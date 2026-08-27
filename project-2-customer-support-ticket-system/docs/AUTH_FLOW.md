# Authentication & Authorization Flow

## 1. Authentication Overview

The application uses JWT-based authentication.

Authentication is responsible for answering:
> "Who is the logged-in user?"

Authorization is responsible for answering:
> "What is this user allowed to do?"

The application has three roles:

- Customer
- Agent
- Admin

The backend is the final authority for authentication and authorization.

---

## 2. Login Flow

The login flow is:

```text
Login.jsx
   ↓
AuthContext.login()
   ↓
authApi.login()
   ↓
axiosInstance
   ↓
POST /users/login
   ↓
Backend
   ↓
Validate email/password
   ↓
Generate JWT
   ↓
Return token + user
   ↓
AuthContext
   ↓
localStorage
   ↓
isAuthenticated = true
   ↓
Navigate to application
```
### File responsibilities
| File                          | Responsibility                                |
| ----------------------------- | --------------------------------------------- |
| `pages/Login.jsx`             | Collects email/password and handles login UI  |
| `context/AuthContext.jsx`     | Manages authentication state                  |
| `api/authApi.js`              | Sends authentication requests                 |
| `api/axiosInstance.js`        | Shared Axios configuration and JWT attachment |
| `routes/PrivateRoute.jsx`     | Protects authenticated routes                 |
| Backend auth route/controller | Validates credentials and generates JWT       |

---

## 3. Where Authentication State Is Stored

AuthContext maintains: `user` and `isAuthenticated`.

The token and user information are also stored in: `localStorage`

This allows the application to restore the login state after a browser refresh.

---

## 4. Application Startup

When the application starts:
```text
main.jsx
   ↓
AuthProvider
   ↓
AuthContext useEffect()
   ↓
Read token + user from localStorage
   ↓
If both exist
   → user = stored user
   → isAuthenticated = true

If missing
   → user = false/null
   → isAuthenticated = false
```
Initially: `isAuthenticated = null`

This represents: Authentication status has not been resolved yet.

This prevents protected routes from immediately redirecting to /login before localStorage has been checked.

---

## 5. Protected Routes

Private routes are wrapped by PrivateRoute.
```text
User requests protected URL
        ↓
PrivateRoute
        ↓
Is authentication resolved?
        │
        ├── No → Loading
        │
        ├── Yes + authenticated
        │       ↓
        │      <Outlet />
        │
        └── Not authenticated
                ↓
            Navigate to /login
```
Example protected routes:
```js
/
 /tickets
 /tickets/:ticketId
 /tickets/:ticketId/edit
 /create
 ```

---

## 6. JWT Request Flow

After login, the JWT is stored in localStorage.

For later API requests:
```text
React component
   ↓
API function
   ↓
axiosInstance
   ↓
Request interceptor
   ↓
Read token from localStorage
   ↓
Add Authorization header
   ↓
Backend
```
The request contains: `Authorization: Bearer <JWT>`

The shared Axios instance avoids manually adding the token in every API function.

---

## 7. Backend JWT Verification

The backend receives the request with the JWT.
```text
Request
   ↓
authMiddleware
   ↓
Read Authorization header
   ↓
Extract JWT
   ↓
Verify JWT
   ↓
Decode user information
   ↓
Attach authenticated user information
   ↓
Continue to controller
```
The JWT contains information such as:
```js
{
  id: user._id,
  role: user.role
}
```
The backend uses this information to identify the user and apply authorization rules.

---

## 8. Authentication vs Authorization

### Authentication
Checks: Who are you?

Example: Is this JWT valid?

Handled mainly by:
  JWT
  authMiddleware
  AuthContext

### Authorization
Checks: What are you allowed to do?

Examples:
  Customer → create ticket
  Agent → update assigned tickets
  Admin → manage all tickets/users
  Authorization is enforced by the backend.

The frontend only controls what actions are displayed in the UI.

---

## 9. Role-Based UI
The frontend uses the logged-in user's role to conditionally display UI.

Example:
```js
if (user.role === "admin") {
  // Admin dashboard
}
```
Another example: `user.role === "admin"`
allows admin-specific actions such as: Delete ticket; Assign agent; Access dashboard

However, hiding a button is NOT security.
The backend still verifies the user's role before allowing the operation.

---

## 10. 401 Unauthorized Handling
The Axios response interceptor handles 401 Unauthorized.
```text
Backend returns 401
       ↓
Axios response interceptor
       ↓
Remove token
       ↓
Remove stored user
       ↓
Redirect to /login
```
This handles cases such as:

-  Expired/invalid JWT
-  Unauthorized API access
-  Invalid authentication state

---

## 11. Logout Flow

Logout is handled by AuthContext.
```text
Logout button
   ↓
AuthContext.logout()
   ↓
Remove token
   ↓
Remove user
   ↓
isAuthenticated = false
   ↓
PrivateRoute redirects to /login
```

---
---

#### Explain your authentication flow.
-  I implemented JWT-based authentication. The user submits credentials from the Login component, which calls AuthContext's login method. AuthContext calls the authentication API, and after successful login the backend returns a JWT and user information. I store them in localStorage and maintain authentication state through React Context.

 - For subsequent API requests, I use a shared Axios instance with a request interceptor that reads the JWT from localStorage and attaches it as a Bearer token in the Authorization header.

-  On the backend, authentication middleware verifies the JWT and identifies the user and their role. Authorization is then applied based on the user's role. The frontend hides or shows role-specific UI, but the backend remains the final authority for authorization.

-  Protected routes use a PrivateRoute component to prevent unauthenticated users from accessing application pages. I also handle 401 responses globally through the Axios response interceptor by clearing authentication data and redirecting the user to the login page.
