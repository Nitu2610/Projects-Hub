# Debugging Notes

This document records important debugging issues encountered while building TechNest.

The purpose is not only to remember the fixes, but to understand how to identify the affected layer, trace the request flow, distinguish configuration/type/runtime issues, and fix the root cause.

---

# 1. Redux Toolkit / RTK Query Debugging

## 1.1 RTK Query reducer configuration

### Problem

RTK Query does not work only by creating an API slice.

The generated API reducer must also be registered in the Redux store.

### Debugging

The API slice contains a `reducerPath`:

```ts
export const apiSlice = createApi({
  reducerPath: "api",
  ...
});
```

That reducer must be registered using the same key:

```ts
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});
```

### Result

RTK Query's cached server state becomes part of the Redux store.

### Lesson

When RTK Query behaves unexpectedly, check all three parts:

```text
createApi()
     ↓
API reducer registered in store
     ↓
API middleware registered in store
```

---

## 1.2 RTK Query middleware

### Problem

RTK Query requires its middleware to be added to Redux.

### Solution

```ts
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(apiSlice.middleware),
```

### Why

The middleware manages RTK Query behavior such as:

* API requests
* caching
* subscriptions
* refetching
* invalidation

### Lesson

Registering only the reducer is not enough.

---

## 1.3 Cookies with RTK Query

### Problem

Authentication uses an HTTP-only cookie instead of storing the JWT in `localStorage`.

The browser therefore needs to include cookies with API requests.

### Solution

Configure the base query:

```ts
baseQuery: fetchBaseQuery({
  baseUrl: baseViteURL,
  credentials: "include",
}),
```

### Debugging lesson

When cookie-based authentication appears to work during login but protected requests return:

```text
401 Unauthorized
```

check whether the frontend request is sending credentials.

### Lesson

For cookie-based authentication:

```text
Frontend request
      ↓
credentials: "include"
      ↓
Browser sends cookie
      ↓
Backend reads cookie
      ↓
JWT verification
```

---

# 2. Authentication Implementation Debugging

## 2.1 HTTP-only cookie behavior

### Problem

The JWT is stored in an HTTP-only cookie.

This means JavaScript cannot access the cookie directly.

For example:

```ts
document.cookie
```

will not expose an HTTP-only cookie.

### Why

This is intentional.

An HTTP-only cookie helps prevent client-side JavaScript from directly reading the authentication token.

### Debugging approach

Do not debug cookie authentication by expecting to see the JWT in:

```text
localStorage
sessionStorage
document.cookie
```

Instead verify:

1. Login response successfully sets the cookie.
2. Browser stores the cookie.
3. Subsequent requests include the cookie.
4. Backend reads `req.cookies.accessToken`.
5. JWT verification succeeds.
6. `/users/me` returns the authenticated user.

### Lesson

Not being able to read the JWT from frontend JavaScript is expected behavior for an HTTP-only cookie.

---

## 2.2 Cookie configuration

The authentication cookie currently uses:

```ts
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
});
```

### `httpOnly`

Prevents JavaScript from reading the cookie.

### `secure`

```ts
secure: process.env.NODE_ENV === "production"
```

The cookie is sent only over HTTPS in production.

During local HTTP development, `secure` must not prevent the browser from accepting the cookie.

### `sameSite`

```ts
sameSite: "strict"
```

Controls cross-site cookie behavior and provides additional CSRF protection.

### Debugging lesson

When a cookie does not appear to work, check:

```text
httpOnly
secure
sameSite
domain
path
expiration
credentials: "include"
```

Do not immediately assume the JWT generation is broken.

---

## 2.3 `/users/me` authentication verification

### Problem

After login, the frontend needs to know whether the user is authenticated.

The frontend does not read the JWT from the cookie.

### Solution

Use:

```text
GET /users/me
```

The request includes the HTTP-only cookie automatically.

The backend:

```text
Cookie
  ↓
authMiddleware
  ↓
JWT verification
  ↓
userId extracted
  ↓
User lookup
  ↓
Authenticated user returned
```

### Debugging

If `/users/me` returns `401`, investigate:

```text
Is cookie present?
       ↓
Is frontend sending credentials?
       ↓
Is accessToken available in request?
       ↓
Is JWT valid?
       ↓
Is JWT expired?
       ↓
Does user still exist?
```

### Relevant status

```text
401 Unauthorized
```

means authentication could not be established.

---

## 2.4 Logout / cookie clearing

### Problem

Logging out must invalidate the browser's authentication cookie.

### Solution

Backend:

```ts
res.clearCookie("accessToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});
```

Frontend calls:

```text
POST /users/logout
```

### Debugging lesson

Logout is not simply a frontend navigation:

```ts
navigate("/login");
```

The server-side cookie must also be cleared.

Otherwise the browser can remain authenticated.

### Correct flow

```text
Click Logout
    ↓
POST /users/logout
    ↓
Server clears cookie
    ↓
Frontend navigates to login
    ↓
Protected request no longer authenticates
```

---

## 2.5 Authentication persistence after page refresh

### Problem

A page refresh destroys React component state.

The application therefore cannot rely on a temporary frontend variable to know whether the user is logged in.

### Solution

On application load:

```text
ProtectedRoute
      ↓
useGetMeQuery()
      ↓
GET /users/me
      ↓
Browser sends HTTP-only cookie
      ↓
Backend verifies JWT
      ↓
User returned
      ↓
Protected page rendered
```

### Important distinction

Authentication persistence does **not** mean persisting the JWT in localStorage.

The authentication state persists because the browser retains the cookie and the application re-validates the session through `/users/me`.

---

# 3. Backend Architecture / Debugging

## 3.1 Route → Middleware → Controller → Service flow

TechNest follows:

```text
Route
 ↓
Middleware
 ↓
Validation
 ↓
Controller
 ↓
Service
 ↓
MongoDB
 ↓
Service
 ↓
Controller
 ↓
Response
```

### Problem

When something fails, changing code randomly can make debugging harder.

### Debugging approach

Trace the request from the outside inward:

```text
Did request reach route?
        ↓
Did middleware execute?
        ↓
Did validation pass?
        ↓
Did controller execute?
        ↓
Did service execute?
        ↓
Did database operation succeed?
        ↓
Was response returned correctly?
```

### Lesson

Identify the failing layer before changing code.

---

## 3.2 Validation middleware flow

The validation architecture is:

```text
Route
 ↓
Validator chain
 ↓
validationResult(req)
 ↓
validatorMiddleware
 ↓
Controller
```

Validation should happen before business logic.

### Example

```ts
userRoute.post(
  "/register",
  userValidator,
  validatorMiddleware,
  asyncHandler(userController.registerCustomer)
);
```

### Lesson

If validation is failing, the controller should not need to handle basic input-format validation.

---

## 3.3 Error propagation through `asyncHandler`

### Problem

Async controller/service errors need to reach the centralized error handler.

### Pattern

```ts
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```

### Flow

```text
Controller/service error
        ↓
Promise rejection
        ↓
asyncHandler
        ↓
next(error)
        ↓
errorHandler
```

### Lesson

`asyncHandler` catches and forwards.

It does not decide how the error should be presented to the client.

---

## 3.4 Centralized error handler

The centralized error handler is responsible for producing the final API error response.

Conceptually:

```text
Error occurs
   ↓
asyncHandler
   ↓
next(error)
   ↓
errorHandler
   ↓
HTTP response
```

This avoids repeating the same error-response logic inside every controller.

### Debugging lesson

If an error is reaching the server but the client receives an unexpected response, inspect the centralized error handler.

---

## 3.5 Controller vs service responsibility

### Problem

Business logic can easily become mixed into controllers.

### Intended responsibility

**Controller**

```text
Request
 ↓
Extract data
 ↓
Call service
 ↓
Send response
```

**Service**

```text
Business logic
 ↓
Database operations
 ↓
Return result
```

### Debugging lesson

If a controller contains large amounts of business logic, ask:

> Does this logic belong to the service layer?

Keeping responsibilities separated makes debugging easier because each layer has a clear purpose.

---

## 3.6 Request/response shape inconsistencies

### Problem

Frontend and backend must agree on the API contract.

For example:

```ts
{
  fullName,
  email,
  password,
  mobile
}
```

must match the backend's expected request fields.

Likewise, the frontend must understand the backend response:

```ts
{
  success,
  message,
  data
}
```

### Debugging approach

Compare:

```text
Frontend request
        ↓
Backend validator
        ↓
Controller
        ↓
Service
```

and:

```text
Backend response
        ↓
RTK Query response type
        ↓
React component
```

### Lesson

Many "frontend bugs" are actually API contract mismatches.

---

# 4. Registration Form Debugging

## 4.1 API request payload matching backend expectations

### Problem

The registration form contains:

```text
fullName
email
password
confirmPassword
mobile
```

But `confirmPassword` is a frontend validation field and is not part of the backend registration API.

### Correct API payload

```ts
await register({
  fullName: formData.fullName.trim(),
  email: formData.email.trim(),
  password: formData.password,
  mobile: formData.mobile.trim(),
}).unwrap();
```

### Debugging lesson

Separate:

```text
Form fields
```

from:

```text
API request fields
```

They do not always have to be identical.

---

## 4.2 API error extraction

### Problem

RTK Query errors do not always have a simple:

```ts
error.message
```

structure.

### Debugging approach

First inspect the actual response.

For example, an API may return:

```json
{
  "success": false,
  "message": "Email already exists."
}
```

The frontend should extract the backend message from the actual response structure instead of assuming every error has the same shape.

### Lesson

When debugging an API error:

```text
Do not guess the error structure.
Inspect the actual response.
Then type/narrow it appropriately.
```

---

# 5. Navigation & Routing Debugging

## 5.1 Nested routes with `MainLayout`

TechNest uses:

```text
AppRoutes
   ↓
ProtectedRoute
   ↓
MainLayout
   ↓
Outlet
```

The layout contains shared UI such as:

```text
Navbar
Main content
Footer
```

### Lesson

Shared UI should live in the layout rather than being duplicated across every page.

---

## 5.2 `Outlet` behavior

### Problem

Nested routes do not automatically render inside the parent component.

`MainLayout` must contain:

```tsx
<Outlet />
```

### Flow

```text
/MainLayout
     ↓
<Outlet />
     ↓
Current child route
```

Without `Outlet`, the child route can match correctly but its component will not appear where expected.

---

## 5.3 Protected route placement

Current structure:

```tsx
<Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
  </Route>
</Route>
```

### Why

The protection applies to the nested customer application routes.

Public routes remain outside it:

```text
/login
/register
/unauthorized
```

### Lesson

Route protection is also an architectural decision.

---

## 5.4 Login/register accessibility

Login and registration must remain accessible without authentication.

Therefore they must not accidentally be nested under:

```tsx
<ProtectedRoute />
```

Otherwise an unauthenticated user could be prevented from reaching the page needed to authenticate.

---

## 5.5 Unauthorized route

### Problem

A logged-in user may be authenticated but have the wrong role.

That is not the same as being logged out.

Example:

```text
Authenticated customer
        ↓
Attempts admin route
        ↓
403 / role denied
        ↓
Unauthorized page
```

The user should not automatically be sent to `/login`.

### Lesson

```text
401 → Login
403 → Unauthorized
```

---

## 5.6 Navbar navigation

The Navbar contains links such as:

```text
Home
Products
Categories
Deals
Search
Cart
Orders
Account
```

### Debugging approach

When navigation fails, verify:

1. Route exists.
2. `NavLink`/`Link` points to the correct path.
3. Route is nested at the expected level.
4. `Outlet` exists in the parent layout.
5. Protected-route rules allow the current user.

---

## 5.7 Active `NavLink` behavior

### Problem

The Home route is `/`.

Without careful matching, Home can appear active while visiting nested routes.

For example:

```text
/
 /products
 /orders
```

The `/` path can match prefixes unexpectedly.

### Better approach

Use:

```tsx
<NavLink to="/" end>
```

The `end` prop ensures Home is considered active only for the exact `/` route.

---

## 5.8 Home route matching nested routes

Current structure:

```tsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<Home />} />
</Route>
```

The `index` route means:

```text
/
```

renders:

```text
Home
```

inside:

```tsx
<Outlet />
```

This keeps the routing structure clean while allowing `MainLayout` to remain shared.

---

# 6. Backend Validation Debugging

## 6.1 `express-validator` validation chain

Example concept:

```ts
body("email")
  .isEmail()
  .withMessage("Please provide a valid email.");
```

Validation rules should describe the expected input format.

---

## 6.2 `validationResult`

After the validator chain runs:

```ts
const errors = validationResult(req);
```

This checks whether validation produced errors.

### Important

Defining validators does not automatically send a response.

The application must read the result.

---

## 6.3 Validator middleware

The validator middleware centralizes this logic:

```text
Validator chain
      ↓
validationResult(req)
      ↓
Errors?
   ↙     ↘
 yes      no
  ↓        ↓
400      Controller
```

This prevents every controller from repeating validation-result handling.

---

## 6.4 Validation errors reaching the controller/service

### Problem

Invalid input should not reach business logic unnecessarily.

Correct flow:

```text
Invalid request
      ↓
Validator
      ↓
400 Bad Request
```

Instead of:

```text
Invalid request
      ↓
Controller
      ↓
Service
      ↓
Database
      ↓
Error
```

### Lesson

Reject invalid input as early as possible.

---

## 6.5 Validation vs business rules

This distinction became important during TechNest development.

### Validation

Checks whether input has the correct structure/format.

Examples:

```text
Email format
Required field
Password length
Mobile format
```

### Business rule

Checks whether the action is allowed.

Examples:

```text
Customer can cancel only before shipment.
Only purchased products can be reviewed.
Out-of-stock products cannot be purchased.
Only admins can create products.
```

### Lesson

Do not put all rules into `express-validator`.

---

# 7. Database / Mongoose Debugging

## 7.1 `select: false` password behavior

The User model uses:

```ts
password: {
  type: String,
  required: true,
  select: false,
}
```

### Problem

A normal query does not return the password.

This is intentional.

However, login requires the stored hash to compare against the submitted password.

### Solution

Explicitly select the password when required:

```text
User.findOne(...).select("+password")
```

### Lesson

`select: false` is a protection mechanism, but authentication code must explicitly request the field when needed.

---

## 7.2 Querying the authenticated user

After JWT verification, the authenticated user's ID is attached to the request:

```ts
req.user = {
  userId,
  role,
};
```

The service can then find the user using that ID.

```text
JWT
 ↓
userId
 ↓
User.findById(userId)
 ↓
Current user
```

### Debugging lesson

If `/users/me` fails, verify the complete chain rather than only the database query.

---

## 7.3 User ID handling

The JWT payload currently contains:

```ts
{
  userId,
  role
}
```

The naming must remain consistent across:

```text
JWT generation
 ↓
JWT verification
 ↓
Express Request type
 ↓
Controller
 ↓
Service
 ↓
MongoDB query
```

### Lesson

A small naming mismatch such as:

```text
userId
```

vs

```text
id
```

can break authentication even though the JWT itself is valid.

---

## 7.4 ObjectId / reference considerations

MongoDB relationships use ObjectId references.

Examples planned for TechNest include:

```text
Order → User
OrderItem → Product
Review → User
Review → Product
Cart → User
CartItem → Product
```

### Debugging considerations

When working with references, verify:

* The referenced document exists.
* The stored ID is valid.
* The correct field is being queried.
* The field name matches the schema.
* `populate()` is used only where the actual referenced document is required.

### Lesson

A reference stores a relationship; it does not automatically contain the complete referenced document.

---

# 8. Authentication Security / Debugging Lessons

## 8.1 Rate limiting awareness for login

### Problem

Authentication endpoints are sensitive to repeated requests.

For example:

```text
POST /users/login
```

could be repeatedly attacked with password guesses.

### V1 decision

Rate limiting was documented as a security requirement/awareness item rather than immediately adding advanced login throttling.

### Production consideration

Sensitive endpoints should have appropriate rate limiting and monitoring.

Examples:

```text
/login
/register
/password-reset
```

### Lesson

A feature can be functionally correct and still require security hardening before production.

---

## 8.2 Security vs functionality debugging

A feature can work technically while still being insecure.

Example:

```text
Login works
```

does not automatically mean:

```text
Authentication implementation is production-ready
```

Security debugging asks additional questions:

* Can the token be accessed by JavaScript?
* Is authorization checked on the backend?
* Are cookies configured correctly?
* Are sensitive endpoints protected against abuse?
* Is user input validated?
* Can users access another user's resources?

### Lesson

Debugging should verify both:

```text
Does it work?
```

and:

```text
Can it be abused?
```

---

# 9. API / Frontend Integration Debugging

## 9.1 Frontend request not matching backend route

### Problem

A frontend request must exactly correspond to a backend route.

Example:

```text
Frontend:
POST /users/register
```

must match the backend route:

```ts
userRoute.post("/register", ...)
```

and the router must be mounted correctly.

### Debugging approach

Trace:

```text
Frontend URL
 ↓
HTTP method
 ↓
Express mounted route
 ↓
Router path
 ↓
Controller
```

A mismatch can result in:

```text
404 Not Found
```

---

## 9.2 Request payload mismatch

Example:

Frontend:

```json
{
  "fullName": "Nitesh",
  "email": "nitesh@gmail.com",
  "password": "******",
  "mobile": "8668056231"
}
```

Backend must expect the same field names.

A mismatch such as:

```text
mobile
```

vs

```text
phone
```

can cause validation or business logic failures.

### Lesson

When an API request fails, inspect the actual request payload.

---

## 9.3 Response structure mismatch

Backend response:

```json
{
  "success": true,
  "message": "Customer registered successfully.",
  "data": {
    "fullName": "Nitesh",
    "email": "nitesh@gmail.com",
    "mobile": "8668056231",
    "role": "customer"
  }
}
```

Frontend TypeScript types must represent the actual response.

### Lesson

The API response is the source of truth when debugging an integration problem.

Do not assume the response shape.

---

## 9.4 HTTP method mismatch

These are different endpoints:

```text
GET /users/me
POST /users/logout
POST /users/register
POST /users/login
```

Calling the correct URL with the wrong HTTP method can result in:

```text
404 Not Found
```

or:

```text
405 Method Not Allowed
```

depending on the server/router configuration.

### Debugging checklist

Verify:

```text
URL
HTTP method
Request body
Headers
Credentials
Expected response
```

---

## 9.5 Authentication credentials not being sent

For cookie authentication:

```ts
credentials: "include"
```

must be configured appropriately.

Without credentials:

```text
Browser
   X
HTTP-only cookie
   X
Backend
```

The backend may then return:

```text
401 Unauthorized
```

### Lesson

If login succeeds but `/users/me` returns `401`, check cookie transmission before rewriting authentication logic.

---

## 9.6 API error status handling

Important statuses used in TechNest:

| Status | Meaning                              |
| ------ | ------------------------------------ |
| `200`  | Successful request                   |
| `201`  | Resource successfully created        |
| `400`  | Invalid request / validation failure |
| `401`  | Authentication required/failed       |
| `403`  | Authenticated but not authorized     |
| `404`  | Resource/route not found             |
| `409`  | Conflict, such as duplicate resource |
| `500`  | Unexpected server error              |

### Important authentication distinction

```text
401 → User needs authentication
403 → User is authenticated but lacks permission
```

The frontend should not treat every API error as a login failure.

---

# 10. Build & Development Environment Debugging

## 10.1 Vite handling frontend builds

The frontend uses Vite.

TypeScript checking is performed separately:

```bash
npx tsc --noEmit
```

Vite handles the actual frontend build:

```bash
npm run build
```

### Important distinction

Frontend:

```text
TypeScript
   ↓
tsc --noEmit
   ↓
Type checking only
```

and:

```text
Vite
   ↓
Production build
```

### Lesson

`tsc --noEmit` does not create frontend JavaScript files.

---

## 10.2 `dist` separation

Backend:

```text
src/
 ↓
tsc
 ↓
dist/
```

Frontend:

```text
src/
 ↓
Vite
 ↓
dist/
```

Generated build files should not be mixed with source files.

### Lesson

Source code and generated output have different responsibilities.

---

## 10.3 `.env` / `.gitignore` issues

Environment variables contain configuration and potentially sensitive values.

Examples:

```text
MONGODB_URI
JWT_SECRET
BCRYPT_SALT_ROUNDS
VITE_API_URL
```

These should not be committed as real secrets.

### `.gitignore`

Important entries include:

```text
.env
.env.example
.env.local
.env.*.local
dist/
```

### Debugging lesson

When an environment variable is `undefined`, do not immediately assume the code is wrong.

Check:

```text
Correct .env location
Correct variable name
Correct frontend/backend prefix
Server restarted after .env changes
Environment variable actually loaded
```

---

# 11. Important Debugging Lessons Learned

## 11.1 Read the exact error before changing code

Do not immediately modify code after seeing:

```text
Something went wrong
```

First identify:

```text
Error message
Status code
Stack trace
Request URL
HTTP method
Request payload
Response body
Browser console
Backend terminal
```

---

## 11.2 Identify which layer caused the problem

TechNest has multiple layers:

```text
React
 ↓
RTK Query
 ↓
HTTP
 ↓
Express route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Mongoose
 ↓
MongoDB
```

A bug should first be localized to a layer.

---

## 11.3 Trace request flow end-to-end

For API problems, trace the complete request:

```text
User action
 ↓
React component
 ↓
RTK Query
 ↓
HTTP request
 ↓
Express route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Database
 ↓
Response
 ↓
RTK Query
 ↓
React UI
```

This prevents fixing only the visible symptom.

---

## 11.4 Separate TypeScript errors from runtime errors

A TypeScript error occurs before/around compilation or type checking.

Example:

```text
Type 'string | undefined' is not assignable to type 'string'
```

A runtime error occurs when the application executes.

Example:

```text
Cannot read properties of undefined
```

These require different debugging approaches.

---

## 11.5 Separate frontend errors from backend errors

A frontend error does not automatically mean the frontend caused the problem.

For example:

```text
Frontend receives 401
```

could actually be caused by:

```text
Cookie not sent
JWT invalid
JWT expired
authMiddleware failure
```

Always trace the request across both sides.

---

## 11.6 Verify assumptions with actual API responses

Do not assume:

```ts
error.message
```

or:

```ts
response.data.user
```

exists.

Inspect the actual response first.

Then define the TypeScript type around the real API contract.

---

## 11.7 Do not blindly trust generated AI code

AI-generated code can:

* compile but contain incorrect logic
* use an outdated library API
* assume a different response structure
* miss an edge case
* introduce unnecessary complexity
* solve the symptom instead of the root cause

Therefore:

```text
AI generates
     ↓
Developer reviews
     ↓
Developer understands
     ↓
Developer tests
     ↓
Developer validates
     ↓
Code is accepted
```

AI is an implementation accelerator, not the final authority.

---

## 11.8 Fix root cause rather than symptoms

Example:

If `/users/me` returns `401`, changing the frontend to ignore the error is not a real fix.

Investigate:

```text
Cookie
 ↓
credentials
 ↓
JWT
 ↓
middleware
 ↓
user lookup
```

Then fix the actual cause.

---

## 11.9 Test after every meaningful change

After changing authentication:

```text
Register
Login
Refresh
/me
Logout
Protected route
Wrong role
```

After changing API integration:

```text
Request
Response
Error response
Status code
```

After changing TypeScript:

```bash
npx tsc --noEmit
```

or for backend:

```bash
npm run build
```

### Lesson

Small, frequent validation makes debugging easier than making many changes and testing everything at the end.

---

# 12. General Debugging Checklist

When something breaks in TechNest:

```text
  1. What exactly failed?
  2. What is the exact error/status code?
  3. Is it frontend, backend, database, configuration, or TypeScript?
  4. What request was sent?
  5. What response was received?
  6. Did the request reach the backend?
  7. Which backend layer failed?
  8. What does the actual API response contain?
  9. Is the problem caused by configuration or code?
  10. What is the root cause?
  11. What is the smallest correct fix?
  12. Did the fix introduce another problem?
  13. Did I test the happy path?
  14. Did I test the relevant edge case?
  15. Did I update the documentation if the debugging revealed a new project rule?

```
---


# 13. Debugging Mindset

The goal of debugging is not:

> "Make the error disappear."

The goal is:

> "Understand why the error happened and prevent the same class of problem from happening again."

For TechNest, every significant debugging issue should ideally produce one of three outcomes:

```text
Bug fixed
   +
Root cause understood
   +
Lesson documented
````

