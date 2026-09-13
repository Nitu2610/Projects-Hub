# TechNest — Learning Notes

## Table of Contents

1. [Redux Toolkit vs RTK Query](#redux-toolkit-vs-rtk-query)
2. [Authentication, Authorization & Ownership](#authentication-authorization--ownership)
3. [Authentication with HTTP-Only Cookies](#authentication-with-http-only-cookies)
4. [Backend Architecture](#backend-architecture)
5. [Error Handling](#error-handling)
6. [Validation](#validation)
7. [Login Flow](#login-flow)
8. [Password Security](#password-security)
9. [JWT](#jwt)
10. [Cookie Security](#cookie-security)
11. [Authentication Persistence](#authentication-persistence)
12. [Protected Routes](#protected-routes)
13. [RTK Query Architecture](#rtk-query-architecture)
14. [TypeScript in TechNest](#typescript-in-technest)
15. [Frontend State Architecture](#frontend-state-architecture)
16. [Backend Layer Responsibilities](#backend-layer-responsibilities)
17. [API Design & Business Rules](#api-design--business-rules)
18. [Backend as the Source of Truth](#backend-as-the-source-of-truth)
19. [Database References vs Snapshots](#database-references-vs-snapshots)
20. [Cart vs Order](#cart-vs-order)
21. [Stock Management](#stock-management)
22. [Design Before Implementation](#design-before-implementation)
23. [AI-Assisted Development Workflow](#ai-assisted-development-workflow)
24. [Documentation as Part of Development](#documentation-as-part-of-development)
25. [Duplication at Database](#duplication-at-database)
---

# Redux Toolkit vs RTK Query

### Redux Toolkit

Redux Toolkit is primarily used to manage **shared client/application state**.

Examples:

* Current authenticated user
* User role
* Application-wide UI state
* Other client-side state shared across components

### RTK Query

RTK Query is part of Redux Toolkit and is primarily used to manage **server state and API communication**.

Examples:

* Products
* Categories
* Cart
* Orders
* Reviews
* Profile/API data

### Key Difference

```text
Server State       → RTK Query
Shared App State   → Redux Toolkit
Local UI State     → React State
```

---

# Authentication, Authorization & Ownership

These are three separate concepts.

### Authentication

**Who are you?**

Authentication determines whether the user is logged in and establishes their identity.

### Authorization

**What are you allowed to do?**

Authorization determines whether the authenticated user's role or permissions allow a particular operation.

### Ownership

**Does this resource belong to you?**

Ownership determines whether the specific resource being accessed belongs to the current user.

### Example

```text
User requests Order #123
        ↓
Authentication
        ↓
Authorization
        ↓
Ownership Check
        ↓
Allow / Reject
```

---

# Authentication with HTTP-Only Cookies

An authentication token can be stored inside an HTTP-only cookie.

```js
res.cookie("accessToken", token, {
  httpOnly: true
});
```

### What does `httpOnly: true` mean?

It prevents client-side JavaScript from directly accessing the cookie.

For example:

```js
document.cookie
```

cannot read an HTTP-only cookie.

However, the browser can still automatically send the cookie to the appropriate server.

### Important

`httpOnly`:

* Prevents JavaScript from reading the cookie.
* Does **not** encrypt the cookie.
* Does **not** prevent the browser from sending it.
* Helps reduce the ability of injected JavaScript to directly steal the authentication cookie.

---

# Backend Architecture

For my MERN projects, I use a **Model–Controller–Service (MCS)** architecture on the backend.

The responsibilities are:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

### Route

Defines the API endpoint and connects middleware with the controller.

### Middleware

Handles cross-cutting concerns such as:

* Authentication
* Authorization
* Validation processing
* Other request-processing concerns

### Controller

Handles:

* HTTP requests
* HTTP responses
* Calling the appropriate service

Controllers should generally remain thin and delegate business logic to services.

### Service

Contains:

* Business logic
* Business rules
* Database-related operations
* Operations that are independent of Express's HTTP-specific behavior

### Model

Defines the database structure and handles Mongoose/database interaction.

---

# MVC vs MCS

### MVC

MVC stands for:

```text
Model
View
Controller
```

The **View** layer is responsible for presentation and is commonly used when the server itself generates the UI.

### MCS

MCS stands for:

```text
Model
Controller
Service
```

In a MERN REST API:

* React handles the presentation layer.
* Express handles the API/backend.
* The Service layer contains business logic.

Therefore, a traditional server-side View layer is generally not required in the backend.

| Layer          | MVC                          | MCS                        |
| -------------- | ---------------------------- | -------------------------- |
| Model          | Data/database                | Data/database              |
| Controller     | Request handling             | Request handling           |
| Service        | Usually not a core layer     | Business logic             |
| View           | Server-rendered UI           | Usually not present        |
| Typical use    | Server-rendered applications | REST APIs/backend services |
| React frontend | Not necessary                | Works very well            |

---

# Why One User Model?

Customer and Admin share common identity information:

* Name
* Email
* Password
* Mobile
* Role

Instead of creating separate authentication models, a single `User` model can represent both.

The `role` determines what the user is allowed to do.

```text
User
 ├── name
 ├── email
 ├── password
 ├── mobile
 └── role
```

Example:

```text
role = "customer"
role = "admin"
```

---

# Error Handling

## `asyncHandler`

`asyncHandler` is a wrapper around asynchronous controllers.

Its responsibility is to catch errors from the controller and pass them to Express using:

```js
next(err);
```

Example:

```js
asyncHandler(userController.registerCustomer)
```

It is connected at the route level.

---

## `errorHandler`

`errorHandler` is centralized Express error-handling middleware.

It:

* Receives errors.
* Logs them when appropriate.
* Determines the appropriate response.
* Sends the error response to the client.

It is registered globally in `app.js`:

```js
app.use(errorHandler);
```

It should be placed after the routes.

Because `errorHandler` is common to the entire application, it belongs in the shared `middleware/` directory rather than inside `user.routes.js`.

---

## Error Propagation Flow

```text
Controller throws
      ↓
asyncHandler catches
      ↓
next(err)
      ↓
errorHandler handles
      ↓
HTTP error response
```

### Key Memory Rule

> **`asyncHandler` = catches**
> **`errorHandler` = handles**

---

# Validation

## Validation vs Business Logic

These solve different problems.

### Validation

Validation asks:

> **Is the incoming data structurally valid?**

Example:

```text
Quantity = "abc"
```

This is a validation problem if the API expects a number.

### Business Logic

Business rules ask:

> **Is the requested operation allowed?**

Example:

```text
Quantity = 10
Stock = 5
```

The quantity may be structurally valid, but purchasing 10 units is not allowed because only 5 are available.

### Key Difference

```text
Validation
    ↓
Is the data valid?

Business Rule
    ↓
Is this operation allowed?
```

---

# `user.validator`, `validationResult` & `validatorMiddleware`

These three components work together.

## `user.validator.js`

Defines validation rules for user input.

Examples:

* Email must be valid.
* Password must be 8–20 characters.
* Required fields must be present.

## `validationResult(req)`

Collects validation errors produced by the validation rules for the current request.

## `validatorMiddleware`

Checks the collected results.

If errors exist:

```text
Validation Errors
      ↓
Stop Request
      ↓
Return 400
```

If no errors exist:

```text
No Errors
    ↓
next()
    ↓
Controller
```

### Complete Flow

```text
user.validator
      ↓
validationResult(req)
      ↓
validatorMiddleware
      ↓
Controller
```

### Key Memory Rule

> **Validator = defines rules**
> **`validationResult` = collects results**
> **`validatorMiddleware` = decides whether to continue**

---

# Login Flow

The login endpoint is:

```http
POST /users/login
```

The request passes through:

```text
POST /users/login
      ↓
loginCustomerValidator
      ↓
validatorMiddleware
      ↓
asyncHandler
      ↓
userController.userLogin
      ↓
userService.userLogin(req.body)
```

## Service Responsibilities

The service:

1. Finds the user by email.
2. Explicitly retrieves the password using `.select("+password")`.
3. Compares the submitted password with the stored bcrypt hash.
4. Generates a JWT if the credentials are valid.

Example:

```js
User.findOne({ email }).select("+password");
```

After successful authentication:

```text
Service
  ↓
JWT generated
  ↓
Controller
  ↓
JWT stored in HTTP-only cookie
  ↓
Browser stores cookie
  ↓
Successful response
```

---

# Password Security

## Why `select: false` for Password?

The schema contains:

```js
password: {
  type: String,
  required: true,
  select: false
}
```

This prevents the password hash from being returned in normal Mongoose queries.

It provides an additional layer of protection against accidentally exposing password hashes.

### Normal Query

```text
User.find(...)
      ↓
Password excluded
```

### Login Query

```js
User.findOne({ email }).select("+password");
```

```text
Login Query
    ↓
Password explicitly included
    ↓
bcrypt.compare()
```

### Key Point

> **Normal query → password excluded**
> **Login query → password explicitly included**

---

# How Is the User's Password Verified?

Passwords are **hashed**, not encrypted.

Therefore, the stored password is not decrypted during login.

Instead, bcrypt compares the submitted plain password against the stored bcrypt hash:

```js
bcrypt.compare(userCreds.password, user.password);
```

Conceptually:

```text
Submitted Password
        +
Stored bcrypt Hash
        ↓
bcrypt.compare()
        ↓
true / false
```

If the result is `true`, the password is valid.

---

# JWT

After the password is successfully verified, a JWT is generated using:

```js
jwt.sign()
```

The payload contains information such as:

```js
{
  id: user._id,
  role: user.role
}
```

The token is signed using:

```text
JWT_SECRET_KEY
```

The token expiration is:

```text
1d
```

### Important

A JWT is normally:

* **Signed**, not encrypted.
* Verified using the server-side secret.
* Not supposed to expose the signing secret to the client.

The client should never have access to:

```text
JWT_SECRET_KEY
```

---

# Cookie Security

## `httpOnly`

```js
httpOnly: true
```

Prevents client-side JavaScript from directly reading the cookie.

---

## `secure`

In production:

```js
secure: true
```

means the cookie should only be transmitted over HTTPS.

Conceptually:

```text
Production:

HTTPS → Cookie ✅
HTTP  → Cookie ❌
```

During local development, where the application may run on:

```text
http://localhost:8080
```

the `secure` option may be conditionally disabled based on the environment.

---

## `sameSite: "strict"`

The `sameSite` attribute controls when the browser sends the cookie in cross-site requests.

Using:

```js
sameSite: "strict"
```

is highly restrictive and helps protect against CSRF by preventing the cookie from being sent in many cross-site contexts.

---

# How Does the Browser Send the Cookie?

JavaScript does not need to manually extract the HTTP-only cookie.

The browser manages it.

When a subsequent request matches the cookie's rules, the browser automatically attaches the cookie to the request.

Conceptually:

```http
Cookie: accessToken=<JWT>
```

Therefore:

```text
Frontend
   ↓
Request
   ↓
Browser automatically attaches cookie
   ↓
Backend
```

The frontend does not need to read the JWT.

---

# JWT Expiration vs Cookie Expiration

These control different things.

### JWT expiration

```js
expiresIn: "1d"
```

Controls how long the JWT itself remains valid.

### Cookie expiration

```js
maxAge
```

Controls how long the browser keeps the cookie.

### Key Difference

```text
JWT expiresIn
    ↓
How long the token is valid

Cookie maxAge
    ↓
How long the browser keeps the cookie
```

These values can be configured independently.

---

# `jwt.verify()`

On protected requests, the server verifies the JWT.

```js
jwt.verify()
```

The verification checks things such as:

* Whether the signature is valid.
* Whether the token has expired.
* Whether the token is otherwise valid according to the verification process.

If verification fails, the request should be rejected.

### Authentication Flow

```text
Cookie
  ↓
Extract JWT
  ↓
jwt.verify()
  ↓
Valid?
 ├── Yes → Continue
 └── No  → Reject
```

---

# Complete JWT Authentication Flow

The complete authentication flow using HTTP-only cookies is:

```text
Client
  ↓
POST /users/login
  ↓
Validation Middleware
  ↓
Controller
  ↓
Service
  ↓
Find User
  ↓
.select("+password")
  ↓
bcrypt.compare()
  ↓
Credentials Valid?
  ├── No → Reject
  └── Yes
       ↓
    Generate JWT
       ↓
    Set HTTP-only Cookie
       ↓
    Browser Stores Cookie
       ↓
    Subsequent Protected Request
       ↓
    Browser Automatically Sends Cookie
       ↓
    Authentication Middleware
       ↓
    jwt.verify()
       ↓
    Allow / Reject
```

### Security Responsibilities

```text
bcrypt
  → Verifies password

JWT
  → Represents authenticated identity

httpOnly cookie
  → Prevents JavaScript from directly accessing JWT

secure
  → Restricts cookie transmission to HTTPS

sameSite
  → Restricts cross-site cookie sending

jwt.verify()
  → Validates the JWT on protected requests
```

---

# Why `POST` for Logout Instead of `GET`?

`GET` is generally intended for retrieving resources without causing state changes.

Logout changes the authentication state, for example by clearing or invalidating the authentication cookie.

Therefore:

```http
POST /logout
```

is appropriate because logout is a state-changing operation.

---

# Authentication Persistence

## The Problem

After login, user information stored only in React or Redux memory is lost when the browser refreshes.

```text
Login
  ↓
Redux/React Memory
  ↓
Browser Refresh
  ↓
Memory Resets
```

## Why?

React and Redux state normally exist in application memory.

A full page reload recreates that application state.

However, the HTTP-only cookie can remain in the browser.

## The Solution

Use the HTTP-only cookie to persist the authentication credential.

When the application starts:

```text
Application Starts
      ↓
GET /users/me
      ↓
Browser automatically sends cookie
      ↓
Backend verifies authentication
      ↓
Current User
```

## Result

The user does not need to log in again after a normal page refresh as long as the authentication cookie is still valid.

---

# `/users/me`

The `/users/me` endpoint determines who is currently authenticated based on the authentication credential.

It is particularly useful for:

* Restoring the session after a refresh.
* Retrieving the current user from the server.
* Getting the latest user information.

## Do We Need `/me` Immediately After Login?

Not necessarily.

If the login response already contains the required safe user information, that data can be used immediately.

```text
POST /login
      ↓
Cookie created
      ↓
User data returned
      ↓
Show user data
```

Calling `/me` immediately afterward could be redundant.

However, after a page refresh:

```text
Browser Refresh
      ↓
React/Redux State Resets
      ↓
HTTP-only Cookie Remains
      ↓
GET /me
      ↓
Current User
```

Therefore, `/me` is especially useful for **session restoration**.

---

# Protected Routes

## Problem

After a page refresh, the frontend does not immediately know whether the user is authenticated.

The HTTP-only cookie may still exist, but `/me` needs time to verify it.

## Solution

`ProtectedRoute` waits for:

```js
useGetMeQuery()
```

to complete.

### While Loading

Display a loading state.

```text
Checking authentication...
```

### If `/me` Succeeds

The user is authenticated.

```text
/me succeeds
    ↓
Render protected route
```

### If `/me` Fails

The user is unauthenticated.

```text
/me fails
    ↓
Redirect to /login
```

### Complete Flow

```text
Page Refresh
      ↓
ProtectedRoute
      ↓
useGetMeQuery()
      ↓
Loading?
 ├── Yes → Show Loading
 └── No
      ↓
Authentication Successful?
 ├── Yes → Render Protected Route
 └── No  → Redirect to /login
```

---

# RTK Query Architecture

RTK Query is part of Redux Toolkit and is designed for managing server state and API communication.

## `createApi()`

Creates an RTK Query API slice.

## `baseQuery`

Defines how RTK Query makes HTTP requests.

## `fetchBaseQuery()`

A lightweight wrapper around the browser's `fetch` API provided by RTK Query.

## `baseUrl`

Defines the common base URL used by API endpoints.

## `endpoints`

Defines the API operations available to the frontend.

## `build.query()`

Primarily used for fetching server data.

Examples:

```text
getProducts
getCategories
getMe
```

## `build.mutation()`

Primarily used for operations that create, update, or delete server data.

Examples:

```text
login
createOrder
updateProfile
deleteProduct
```

## Generated Hooks

RTK Query generates React hooks from endpoint definitions.

For example:

```text
getMe
  ↓
useGetMeQuery()
```

---

# RTK Query + Redux Store

RTK Query integrates with the Redux store.

### `apiSlice.reducer`

Stores RTK Query state and cache inside Redux.

### `apiSlice.middleware`

Enables RTK Query behavior such as:

* Request management
* Cache management
* Subscription behavior

### `reducerPath`

Defines where the RTK Query state is stored in the Redux state tree.

Conceptually:

```text
Redux Store
   │
   ├── Client/Application State
   │
   └── RTK Query State
           ├── Cache
           ├── Requests
           └── Subscriptions
```

---

# TypeScript in TechNest

TypeScript is being introduced progressively into the TechNest project.

The main purposes are:

* Catching type-related errors during development.
* Making contracts between different parts of the application clearer.
* Improving maintainability.
* Making external data handling more explicit.

---

# TypeScript File Extensions

## Frontend

### `.ts`

TypeScript files without JSX.

### `.tsx`

TypeScript files containing JSX.

## Backend

Backend TypeScript files generally use:

```text
.ts
```

---

# Where TypeScript Is Used

TypeScript is used for:

* API request and response types.
* React component props.
* Form data.
* Redux types.
* RTK Query types.
* Express request/response handling.
* Authentication payloads.
* Service contracts.
* Controller contracts.

---

# Why Use TypeScript with JavaScript?

JavaScript remains the runtime language.

TypeScript adds a **static type-checking layer during development**.

For example:

```ts
const age: number = "32";
```

TypeScript reports a type mismatch during development.

The TypeScript source is ultimately transformed/handled as JavaScript for execution.

### Key Idea

```text
JavaScript
   +
TypeScript static type checking
   ↓
Safer development
```

---

# `string | undefined` and Environment Variables

Environment variables may not exist.

For example:

```ts
const secret = process.env.JWT_SECRET_KEY;
```

TypeScript may therefore treat the value as:

```text
string | undefined
```

The application should check that required environment variables exist before using them.

After an appropriate check, TypeScript can narrow the value to:

```text
string
```

### Concept

```text
process.env.JWT_SECRET_KEY
        ↓
string | undefined
        ↓
Check exists
        ↓
string
```

This is especially important for required configuration such as JWT secrets.

---

# `unknown` in Catch Blocks

Values caught by a `catch` block should be treated as potentially `unknown`.

TypeScript does not assume that every thrown value is an `Error`.

Example:

```ts
try {
  // operation
} catch (error) {
  // error is unknown
}
```

Before accessing properties such as:

```ts
error.message
```

the value should be narrowed or checked.

### Key Idea

```text
unknown
   ↓
Type check / narrowing
   ↓
Safely use the value
```

---

# Type Narrowing

Type narrowing means reducing a broad type to a more specific type after checking it.

Example:

```ts
if (typeof value === "string") {
  // value is now treated as string
}
```

Type narrowing is particularly useful with:

* `unknown`
* Union types
* API errors
* Optional values
* Environment variables

---

# Type Assertions

A type assertion tells TypeScript how we intend to treat a value.

Example:

```ts
const payload = decoded as AuthPayload;
```

A type assertion does **not** perform runtime validation.

### Important Difference

```text
Type Assertion
    ↓
Tells TypeScript what we believe

Runtime Validation
    ↓
Actually checks the value
```

Therefore, external or untrusted data should not automatically be considered safe simply because a type assertion was used.

---

# JWT `verify()` and TypeScript

`jwt.verify()` can return different types.

Therefore, TypeScript cannot automatically assume that the returned value matches the application's authentication structure.

Before using properties such as:

```text
userId
role
```

the result should be appropriately narrowed or typed.

This is a good example of TypeScript forcing us to think carefully about data coming from an external source.

---

# Express Request Type Augmentation

Authentication middleware may attach authenticated user information to:

```ts
req.user
```

However, Express's default `Request` type does not know about this custom property.

Therefore, the Express `Request` type can be extended using **declaration merging**.

Conceptually:

```text
Express Request
      +
Application-specific user data
      ↓
Extended Request type
```

This allows TypeScript to understand:

```ts
req.user
```

throughout the appropriate parts of the application.

---

# TypeScript API Contracts

RTK Query endpoints can define both request and response types.

Conceptually:

```text
Request Type
      ↓
API Request
      ↓
Backend Response
      ↓
Response Type
```

This makes the expected API contract explicit on the frontend.

If the frontend expects a field that does not exist in the defined response type, TypeScript can identify the problem during development.

---

# Frontend `tsc --noEmit`

The TechNest frontend uses:

```bash
tsc --noEmit
```

### `tsc`

Runs the TypeScript compiler/type checker.

### `--noEmit`

Tells TypeScript to check the code without generating JavaScript output.

Vite remains responsible for the frontend build process.

This keeps generated JavaScript out of the frontend source directory.

---

# Backend TypeScript Build

The backend uses TypeScript compilation to generate JavaScript into the `dist` directory.

### Source

```text
src/
  *.ts
```

### Build Output

```text
dist/
  *.js
```

The generated `dist` directory is not committed to Git.

---

# Why Separate Source and Build Output?

Source code contains the code developers maintain.

Build output contains generated files.

Therefore:

```text
src
  ↓
Developer-maintained source

dist
  ↓
Generated output
```

This keeps generated files separate from the original TypeScript source.

---

# Frontend State Architecture

TechNest separates state based on its responsibility.

## RTK Query — Server State

Used for data that originates from the backend/API.

Examples:

* Products
* Categories
* Cart
* Orders
* Reviews
* Profile/API data

## Redux Toolkit — Shared Client/Application State

Used for application-wide client state.

Examples:

* Current authenticated user
* User role
* Other shared application state

## React Local State — Component-Specific UI State

Used for state that belongs only to a particular component.

Examples:

* Form inputs
* Modal visibility
* Temporary UI interactions

### Mental Model

```text
Server Data
    ↓
RTK Query

Shared Application State
    ↓
Redux Toolkit

Component-Specific UI State
    ↓
React State
```

---

# Backend Layer Responsibilities

TechNest follows a Model–Controller–Service architecture.

| Layer      | Responsibility                                                    |
| ---------- | ----------------------------------------------------------------- |
| Route      | Defines API endpoint and connects middleware/controller           |
| Middleware | Authentication, authorization, validation, cross-cutting concerns |
| Controller | Handles HTTP request/response                                     |
| Service    | Contains business logic and enforces business rules               |
| Model      | Defines database structure and Mongoose interaction               |
| MongoDB    | Persists application data                                         |

### Backend Flow

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

---

# API Design vs Business Rules

These are different concepts.

## API Design

Describes:

> **How the application communicates.**

Example:

```http
PATCH /orders/:orderId/cancel
```

This defines an operation exposed through the API.

## Business Rules

Describe:

> **What the application should allow or prevent.**

Example:

```text
Customer cannot cancel an order after it has been shipped.
```

The API defines the operation.

The business rule determines whether the operation is actually allowed.

### Example

```text
API:
PATCH /orders/:orderId/cancel

        +

Business Rule:
Cannot cancel after shipping

        ↓

Service decides whether operation is allowed
```

---

# Backend as the Source of Truth

Frontend restrictions improve the user experience, but they should not be treated as security.

For example:

```text
Frontend hides Admin button
        ↓
Only UI protection
```

A user may still attempt to call the API directly.

Therefore, the backend must verify:

```text
Is the user authenticated?
        ↓
Does the user have the required role?
        ↓
Does the user own the resource?
        ↓
Is the operation allowed?
        ↓
Allow / Reject
```

### Key Principle

```text
Frontend
  ↓
User experience

Backend
  ↓
Security + Business Authority
```

---

# Authentication vs Authorization vs Ownership

These checks should be treated separately.

### Authentication

```text
Is the user logged in?
```

### Authorization

```text
Does the user's role allow this operation?
```

### Ownership

```text
Does this specific resource belong to this user?
```

### Example

A customer requests:

```text
Order #123
```

The backend may perform:

```text
Authentication
      ↓
Authorization
      ↓
Ownership Check
      ↓
Allow / Reject
```

---

# API Status Codes

HTTP status codes communicate the result of an API operation.

| Status Code | Meaning                            |
| ----------: | ---------------------------------- |
|       `200` | Successful request                 |
|       `201` | Resource created                   |
|       `400` | Invalid request / validation error |
|       `401` | Not authenticated                  |
|       `403` | Authenticated but not allowed      |
|       `404` | Resource not found                 |
|       `409` | Conflict                           |
|       `500` | Unexpected server error            |

### Important Distinction

```text
401 → Who are you?

403 → You are authenticated,
      but you are not allowed.
```

---

# Database References vs Snapshots

Not every relationship should be modeled in the same way.

## Reference

Use a reference when the application needs the **current related entity**.

Example:

```text
Product
   ↓
categoryId
   ↓
Category
```

If the category's current information changes, the product can still refer to the current category.

## Snapshot

Use a snapshot when historical information must remain unchanged.

Example:

```text
Order
 ├── priceAtPurchase
 └── deliveryAddress
```

### Key Difference

```text
Reference
   ↓
Current related data

Snapshot
   ↓
Historical data
```

---

# Why Store `priceAtPurchase`?

Product prices can change after a customer makes a purchase.

Example:

```text
Purchase price:
₹2,499

Current product price:
₹2,999
```

The old order must still show:

```text
₹2,499
```

Therefore, the order stores the price at the time of purchase.

This protects historical transaction accuracy.

---

# Why Store the Delivery Address in the Order?

A customer's current address can change after placing an order.

For example:

```text
Address at purchase
        ↓
Order stores address snapshot
        ↓
Customer changes current address
        ↓
Old order remains unchanged
```

The historical order must still show where the order was originally supposed to be delivered.

Therefore, the order stores a snapshot of the delivery address.

---

# Cart vs Order

Cart and Order represent different business concepts.

## Cart

Represents what the customer currently intends to buy.

## Order

Represents a completed purchase transaction.

### Flow

```text
Product
   ↓
Cart
   ↓
Checkout
   ↓
Payment
   ↓
Order
```

A cart does not automatically guarantee that stock will remain available.

Stock should be revalidated by the backend during the appropriate transaction/checkout process.

---

# Stock Management

Product stock represents the currently available quantity.

Example:

```text
Stock = 10
Purchase = 3
Remaining = 7
```

### Important Business Rules

* Stock cannot become negative.
* Customers cannot purchase more than available stock.
* Stock changes must be controlled by the backend.
* Failed payment should not incorrectly reduce permanent stock.
* Concurrent purchases must be considered to prevent overselling.

### Example

```text
Available Stock = 5
Customer requests = 10

        ↓

Business Rule Check

        ↓

Reject
```

---

# Why Business Rules Must Be Documented Before Implementation

Without clearly defined business rules, implementation decisions can become inconsistent.

For example:

> Can a customer cancel an order after it has been shipped?

This should be decided as a business rule first.

Then the implementation can follow:

```text
Business Rule
      ↓
API Design
      ↓
Service Logic
      ↓
Controller
      ↓
Frontend UI
```

This prevents the frontend or backend implementation from accidentally defining business behavior.

---

# API Design vs Database Design vs Business Rules

These three areas answer different questions.

## Business Rules

> **What should the system allow?**

Example:

```text
Customer can review only purchased products.
```

## API Design

> **How will the frontend communicate with the backend?**

Example:

```http
POST /products/:productId/reviews
```

## Database Design

> **How will the required information be stored?**

Example:

```text
Review
 ├── user
 ├── product
 ├── rating
 └── comment
```

### How They Work Together

```text
Business Rule
      ↓
Customer can review only purchased products
      ↓
API Design
      ↓
POST /products/:productId/reviews
      ↓
Database Design
      ↓
Review stores user + product relationship
      ↓
Implementation
```

These three designs should work together before implementation begins.

---

# Why the Backend Should Not Trust Frontend Calculations

The frontend can calculate and display values for user experience.

However, the backend should recalculate important values because the client can be modified or manipulated.

Important backend-controlled values include:

* Product price
* Quantity
* Stock availability
* Order total
* Permissions

### Key Principle

```text
Frontend Calculation
        ↓
Display / Convenience

Backend Calculation
        ↓
Business Decision
```

The frontend should never be considered the authority for security-sensitive or financially important calculations.

---

# Design Before Implementation

Before implementing a major feature, TechNest follows this general process:

```text
Requirement
    ↓
Business Rules
    ↓
Architecture
    ↓
Database Design
    ↓
API Design
    ↓
Implementation
    ↓
Testing
    ↓
Debugging
    ↓
Documentation
```

This approach:

* Reduces random implementation decisions.
* Makes business behavior explicit.
* Keeps database and API design aligned.
* Makes the project closer to real-world development.

---

# AI-Assisted Development Workflow

In TechNest, AI is used primarily as an **implementation assistant**.

## What AI Can Generate

AI can help generate:

* Boilerplate code
* Components
* Controllers
* Services
* API endpoints
* Types
* Repetitive implementation code

However, the developer remains responsible for the final result.

## Developer Responsibilities

My responsibility as the developer is to:

* Define requirements.
* Decide business rules.
* Make architecture decisions.
* Review generated code.
* Validate types and API contracts.
* Test the implementation.
* Debug problems.
* Check security and edge cases.
* Check performance.
* Check maintainability.
* Understand why the generated code works.

### Key Principle

```text
AI
  ↓
Generates implementation

Developer
  ↓
Owns decisions
  ↓
Validates implementation
  ↓
Tests implementation
  ↓
Owns final responsibility
```

---

# AI Code Should Not Be Blindly Trusted

Generated code may be syntactically correct while still being wrong for the application's requirements.

Before accepting generated code, ask:

### Requirements

* Does it satisfy the business rule?

### API

* Does it match the API contract?

### Database

* Does it match the database design?

### Security

* Is authentication handled correctly?
* Is authorization enforced?
* Are ownership checks present?

### Edge Cases

* Are important edge cases handled?
* What happens with invalid input?
* What happens when the resource does not exist?
* What happens under concurrent operations?

### Maintainability

* Is the code maintainable?
* Does it introduce unnecessary complexity?
* Is the implementation consistent with the existing architecture?

### Review Flow

```text
Generated Code
      ↓
Review
      ↓
Validate
      ↓
Test
      ↓
Accept / Modify / Reject
```

---

# Documentation as Part of Development

Documentation is not something that only happens after coding.

Different types of documentation support different stages of development.

## Design Documents

Help make decisions before implementation.

## Learning Notes

Capture concepts understood during development.

## Debugging Notes

Capture important problems and their solutions.

## Challenge Notes

Capture difficult decisions and lessons learned.

### Development Learning Cycle

```text
Documentation
      ↓
Understand
      ↓
Decide
      ↓
Implement
      ↓
Learn
      ↓
Improve
      ↓
Document
```
Documentation therefore becomes part of the development process rather than merely an afterthought.

---

# Duplication at Database
#### How did you prevent duplicate categories when category names were case-insensitive?
- **Problem:**  Categories like Electronics and electronics should be treated as the same category when the 2or more admins wish to add new category.
- **Normalization:** I normalized the category name before checking or storing it, so different cases map to the same value.
- **Solution** - 
  - **1. Service-level check:** Before creating a category, the service checks whether the normalized name already exists and returns a meaningful business error if it does.
  - **2. Database protection:** I also added a unique index on the normalized category name.
  - **Why both?**
    - Service check → gives a clear, user-friendly error.
    - Unique index → provides the final data-integrity guarantee and prevents duplicates during concurrent requests.
    - Result: Duplicate categories are prevented even when multiple requests arrive at the same time.
- Complete mental model 
  ```text
          Category.create()
                │
        ┌──────┴──────┐
        │             │
      Success        Error
        │             │
        ↓             ↓
  return success   catch(error)
                      │
            ┌─────────┴─────────┐
            │                   │
          code 11000          other error
            │                   │
            ↓                   ↓
      ALREADY_EXIST          throw err
                                │
                                ↓
                          global handler
  ```
  ---
- Code:

    ```ts
    // From category.model.ts 
    const categorySchema= new mongoose.Schema<Category>(
    {
      name:{..}
      normalizedName:{
        type:String,
        required:true,
        unique:true,  
      // Creates a MongoDB unique index.
      // This prevents duplicate normalizedName values,
      // even when concurrent requests reach the database.
      // If a duplicate insert is attempted, MongoDB throws
      // a duplicate-key error with code 11000.
        },
    })

    // From category.service.ts
      addCategory: async (categoryName: categoryData) => {
      try {
    } catch (err: unknown
      // err could be any data type 
      // and at this stage we are not aware of it so we assign it as unknown.
    ) { 
    if (
      typeof err === "object" &&
        // Narrow the unknown error to an object.
        
        err !== null &&
        // Check that the error is not null because:
        // typeof null === "object" in JavaScript.
        
        "code" in err &&
        // Check that the error object contains a "code" property.
        // Mongoose/MongoDB provides this code for database errors.
        
        err.code === 11000
        // MongoDB error code 11000 means a duplicate-key violation.
        // Here, it indicates that the unique normalizedName constraint
        // was violated.
      ) {
      return {...};
    }
    throw err; // if not the duplicate error, treat as normal error.
    },}
    ```
- Mental model
    ```text
    unique: true
          ↓
    MongoDB unique index
          ↓
    Duplicate insert
          ↓
    MongoDB rejects it
          ↓
    error code 11000
          ↓
    catch (err: unknown)
          ↓
    Type narrowing
          ↓
    handle known duplicate error
          ↓
    throw everything else
    ```
---

# TechNest Core Mental Model

The major concepts in TechNest can be summarized as follows:

```text
                    TECHNEST
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Frontend       Backend        Database
        │              │              │
        │              │              │
   React State       Routes        MongoDB
   Redux Toolkit     Middleware    Mongoose
   RTK Query         Controller
   TypeScript        Service
                     Model
        │              │
        └───────┬──────┘
                │
          API Contracts
                │
          Business Rules
                │
             Security
```

## State

```text
Server State
    → RTK Query

Shared Client State
    → Redux Toolkit

Local UI State
    → React State
```

## Backend

```text
Route
  → Middleware
  → Controller
  → Service
  → Model
  → MongoDB
```

## Security

```text
Authentication
  → Who are you?

Authorization
  → What are you allowed to do?

Ownership
  → Does this resource belong to you?
```

## Authentication

```text
Password
  → bcrypt

Authenticated Identity
  → JWT

JWT Storage
  → HTTP-only Cookie

Cookie Transport
  → secure

Cross-Site Protection
  → sameSite

Protected Request
  → jwt.verify()
```

## Development

```text
Requirement
  ↓
Business Rules
  ↓
Architecture
  ↓
Database Design
  ↓
API Design
  ↓
Implementation
  ↓
Testing
  ↓
Debugging
  ↓
Documentation
```

## AI-Assisted Development

```text
AI-generated Implementation
          ↓
       Review
          ↓
      Validate
          ↓
        Test
          ↓
 Accept / Modify / Reject
```

---

# Final Principles

The most important principles to remember from the TechNest project are:

1. **RTK Query manages server state; Redux Toolkit manages shared client state.**
2. **React local state is for component-specific UI state.**
3. **Authentication, authorization, and ownership are separate checks.**
4. **The backend is the source of truth for security and business rules.**
5. **Controllers handle HTTP; services handle business logic.**
6. **Services should not depend on Express's `next()` because they should remain independent of HTTP middleware concerns.**
7. **`asyncHandler` catches controller errors; `errorHandler` handles them centrally.**
8. **Validation checks structural correctness; business rules determine whether an operation is allowed.**
9. **Passwords are hashed, not decrypted.**
10. **`select: false` prevents password hashes from being returned by normal queries.**
11. **JWTs are signed, not normally encrypted.**
12. **HTTP-only cookies prevent JavaScript from directly reading authentication cookies.**
13. **`secure` protects cookie transmission over HTTPS.**
14. **`sameSite` helps restrict cross-site cookie transmission and contributes to CSRF protection.**
15. **JWT expiration and cookie expiration are different concepts.**
16. **`/me` is particularly useful for restoring authentication state after a page refresh.**
17. **Type assertions do not perform runtime validation.**
18. **External data should be narrowed or validated before being trusted.**
19. **References represent current related data; snapshots preserve historical information.**
20. **Orders should preserve historical values such as purchase price and delivery address.**
21. **The backend should recalculate important values instead of trusting frontend calculations.**
22. **Business rules should be defined before implementation.**
23. **API design, database design, and business rules should be designed together.**
24. **AI can accelerate implementation, but the developer owns the decisions, validation, testing, security, and final responsibility.**
25. **Documentation is part of development, not merely something done after coding.**
