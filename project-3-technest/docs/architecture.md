# TechNest Architecture

## 1. Overall Architecture

TechNest follows a full-stack MERN architecture with a clear separation between frontend, backend, and database responsibilities.

```text
User
 ↓
React + TypeScript Frontend
 ↓
RTK Query / Redux Toolkit
 ↓
HTTP Request
 ↓
Express + TypeScript Backend
 ↓
Routes
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

The backend follows a **Model–Controller–Service (MCS)** style architecture.

---

## 2. Frontend Architecture

### Technology

* React
* TypeScript
* Vite
* Chakra UI
* React Router
* Redux Toolkit
* RTK Query
* React Icons

### Frontend responsibility

The frontend is responsible for:

* Rendering the user interface
* Handling user interactions
* Client-side form validation
* Client-side routing
* Managing application/client state
* Fetching and caching server data
* Displaying loading, error, and empty states
* Sending requests to the backend

The frontend is **not the final authority for security or business rules**.

---

## 3. Frontend State Architecture

TechNest separates state based on its responsibility.

### RTK Query → Server State

RTK Query is responsible for data that comes from the backend.

Examples:

* Products
* Categories
* Cart
* Orders
* Reviews
* User profile
* Authentication/session data retrieved from the backend

RTK Query handles:

* API requests
* Loading states
* Error states
* Caching
* Request lifecycle

---

### Redux Toolkit → Application/Client State

Redux Toolkit is used for application-level state that needs to be shared across the frontend.

Examples:

* Current authenticated user
* User role
* Other shared application state when required

Redux should not be used simply because a piece of state exists.

The state-management approach is selected according to the responsibility of the data.

---

### React Local State → Component State

React local state is used for UI state that belongs to a specific component.

Examples:

* Form input
* Modal visibility
* Selected quantity
* UI toggles
* Temporary component-specific values

---

## 4. TypeScript Architecture

TechNest uses TypeScript across the frontend and backend.

### Frontend

```text
.ts
→ TypeScript modules

.tsx
→ React components containing JSX
```

### Backend

```text
.ts
→ TypeScript application modules
```

TypeScript is used to provide stronger type safety across:

* API request data
* API response data
* React component props
* Form events
* Redux/RTK Query
* Express request/response handling
* Authentication payloads
* Service and controller contracts

The frontend uses:

```text
tsc --noEmit
```

for type checking, while Vite handles the frontend production build.

The backend uses TypeScript compilation through `tsc`.

Generated build output is kept separate from source code and is not committed to Git.

---

# 5. Backend Architecture

### Technology

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* express-validator
* cookie-parser
* CORS
* Morgan
* dotenv

### Backend responsibility

The backend is responsible for:

* Authentication
* Authorization
* Business rules
* Input validation
* Database operations
* Data integrity
* Security-sensitive operations
* API responses
* Error handling

---

## 6. Backend MCS Architecture

TechNest uses a Model–Controller–Service architecture.

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
Model
 ↓
MongoDB
```

### Routes

Responsible for:

* Defining API endpoints
* Connecting endpoints to middleware/controllers

### Middleware

Responsible for cross-cutting request processing such as:

* Authentication
* Authorization
* Validation
* Error handling

### Controllers

Responsible for:

* Receiving HTTP requests
* Extracting required data
* Calling services
* Returning HTTP responses

Controllers should remain relatively thin.

### Services

Responsible for:

* Business logic
* Database-related operations
* Reusable application logic

### Models

Responsible for:

* Defining MongoDB document structure
* Mongoose schema/model behavior

---

# 7. Authentication Architecture

TechNest currently supports local authentication using email/password.

### Registration

```text
Customer
 ↓
Registration Form
 ↓
Frontend validation
 ↓
POST /users/register
 ↓
Backend validation
 ↓
Check duplicate email
 ↓
Hash password with bcrypt
 ↓
Create customer
 ↓
Return response
```

Customers can self-register.

Admin accounts are created separately and are not available through public customer registration.

---

## 8. Login Architecture

```text
Customer
 ↓
Login Form
 ↓
POST /users/login
 ↓
Backend validates credentials
 ↓
Find user
 ↓
Compare password using bcrypt
 ↓
Generate JWT
 ↓
Set HTTP-only accessToken cookie
 ↓
Return login response
```

The JWT is stored in an **HTTP-only cookie** rather than browser-accessible storage.

The frontend therefore does not directly read or manage the JWT.

---

## 9. Session Restoration

After login, the browser automatically sends the authentication cookie with requests.

The frontend uses:

```text
GET /users/me
```

to retrieve the currently authenticated user.

```text
Browser
 ↓
HTTP-only accessToken cookie
 ↓
GET /users/me
 ↓
Authentication middleware
 ↓
Verify JWT
 ↓
Identify user
 ↓
Return current user
 ↓
Frontend knows authenticated user
```

This allows the application to restore the user's authenticated state after a browser refresh.

---

# 10. Authentication and Authorization

Authentication and authorization are treated as separate responsibilities.

### Authentication

Answers:

> Who is the user?

Handled through:

* JWT
* HTTP-only cookie
* Authentication middleware
* `/users/me`

### Authorization

Answers:

> What is this user allowed to do?

Handled through:

* User roles
* Authorization middleware
* Backend role checks

Current roles:

```text
customer
admin
```

The backend remains the final security boundary.

Frontend route protection improves user experience, but it cannot replace backend authorization.

---

# 11. Protected Route Architecture

The frontend uses a `ProtectedRoute` component.

```text
User requests protected page
 ↓
ProtectedRoute
 ↓
GET /users/me
 ↓
 ┌──────────────────────────────┐
 │                              │
401                         Successful
 │                              │
 ↓                              ↓
/login                    Check user role
                                │
                         ┌──────┴──────┐
                         │             │
                    Correct role    Wrong role
                         │             │
                         ↓             ↓
                  Protected page  /unauthorized
```

This separates:

* Unauthenticated users
* Authenticated users
* Unauthorized users

---

# 12. Logout Architecture

Logout uses the backend to clear the authentication cookie.

```text
User clicks Logout
 ↓
POST /users/logout
 ↓
Backend clears accessToken cookie
 ↓
Logout successful
 ↓
Frontend navigates to /login
```

The frontend does not attempt to manually remove the JWT because the token is stored in an HTTP-only cookie.

---

# 13. API Communication Architecture

Frontend API communication is handled through **RTK Query**.

```text
React Component
 ↓
RTK Query Hook
 ↓
API Request
 ↓
Express Backend
 ↓
Response
 ↓
RTK Query
 ↓
React Component
```

The API layer is kept separate from UI components so that API communication does not become tightly coupled to individual components.

---

# 14. Error Handling Architecture

Errors can occur at different layers.

```text
Frontend
 ↓
API
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Database
```

The backend uses centralized error handling so that unexpected errors can be processed consistently.

The frontend handles:

* Validation errors
* Authentication errors
* Authorization errors
* API errors
* Loading states
* Empty states

Important authentication status distinction:

```text
401 → User is not authenticated

403 → User is authenticated but not authorized
```

---

# 15. Current Architecture Progress

### Frontend

* React + Vite setup — ✅
* Chakra UI — ✅
* React Router — ✅
* Redux Toolkit — ✅
* RTK Query — ✅
* Main layout — ✅
* Navbar — ✅
* Footer — ✅
* TypeScript migration — ✅
* Authentication UI — ✅
* Protected routes — ✅
* Unauthorized page — ✅
* Logout integration — ✅
* Product UI — ⏳
* Cart UI — ⏳
* Checkout UI — ⏳
* Order UI — ⏳
* Admin UI — ⏳

### Backend

* Node/Express setup — ✅
* MongoDB/Mongoose setup — ✅
* MCS architecture — ✅
* Validation — ✅
* Error handling — ✅
* TypeScript migration — ✅
* User model — ✅
* Customer registration — ✅
* Login — ✅
* JWT authentication — ✅
* HTTP-only cookie — ✅
* `/users/me` — ✅
* Authorization middleware — ✅
* Logout — ✅
* Product APIs — ⏳
* Cart APIs — ⏳
* Order APIs — ⏳
* Review APIs — ⏳
* Admin APIs — ⏳

---

# 16. Architecture Principles

TechNest follows these principles:

1. **Separate responsibilities**

   * UI, API, business logic, and database operations should not be unnecessarily mixed.

2. **Backend is the security boundary**

   * Frontend restrictions are primarily for UX.
   * Authentication and authorization must be enforced by the backend.

3. **Use the simplest appropriate state-management solution**

   * RTK Query for server state.
   * Redux Toolkit for shared application state.
   * React local state for component-specific UI state.

4. **Use TypeScript for safer development**

   * API contracts, props, request data, response data, and backend structures should be explicitly typed where useful.

5. **Avoid unnecessary abstraction**

   * Introduce abstractions when repetition or complexity justifies them.

6. **Keep business logic out of controllers where possible**

   * Controllers coordinate HTTP requests/responses.
   * Services contain application/business logic.

7. **Functionality before visual perfection**

   * Build reliable functionality first.
   * Improve UI/UX progressively.

---

# 17. Planned Architecture Enhancements

The following are planned but **not yet implemented**:

* Google OpenID Connect authentication
* Product management
* Product search/filter/sort/pagination
* Cart management
* Checkout
* Payment simulation
* Order management
* Reviews
* Admin dashboard
* Cloudinary image management
* Production security hardening
* Rate limiting/login throttling
* Deployment
