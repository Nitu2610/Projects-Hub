# Application Architecture

## 1. Architecture Overview

The application follows a client-server architecture using the MERN stack.

```text
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│ Pages / Components          │
│ Context API / Custom Hooks  │
│ API Modules                 │
│ Axios                       │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│    Node.js + Express API    │
│                             │
│ Routes                      │
│ Middleware                  │
│ Controllers                 │
│ Validation                  │
│ Business Logic              │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users                       │
│ Tickets                     │
└─────────────────────────────┘
```
The frontend is responsible for the user interface and client-side state.

The backend is responsible for API handling, authentication, authorization, validation, business rules, and database operations.

MongoDB stores the application's persistent data.

---
## 2. Frontend Architecture

The frontend is organized around pages, reusable components, contexts, custom hooks, API modules, routes, and utilities.
```text
src/
│
├── api/
│   ├── authApi.js
│   ├── axiosInstance.js
│   ├── ticketApi.js
│   └── userApi.js
│
├── components/
│   └── Reusable UI components
│
├── context/
│   ├── AuthContext.jsx
│   └── TicketsContext.jsx
│
├── customHooks/
│   ├── useDebounce.js
│   ├── useForm.js
│   └── useTickets.js
│
├── pages/
│   └── Application pages
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── PrivateRoute.jsx
│   └── NotFound.jsx
│
└── utils/
    └── Reusable helper functions
```

---

## 3. Frontend Layer Responsibilities
### Pages
Pages represent application-level screens and features.
Examples:
  -  Login.jsx
  -  Register.jsx
  -  Home.jsx
  -  Tickets.jsx
  -  TicketDetails.jsx
  -  CreateTicket.jsx
  -  EditTicket.jsx
  -  AdminDashboard.jsx

Pages generally coordinate UI state, business actions, navigation, and API/context usage.

### Components
Components contain reusable UI and presentation logic.
Examples:
  -  Navbar
  -  TicketCard
  -  TicketForm
  -  Pagination
  -  FilterComp
  -  DashboardCard
  -  Loading
  -  ErrorMessage

The goal is to avoid putting the same UI logic directly into multiple pages.

### Context
Context is used for state that needs to be shared across multiple components.
The application currently uses: `AuthContext and TicketsContext `

`AuthContext` manages:
  -  Current user
  -  Authentication state
  -  Login
  -  Logout

`TicketsContext` manages:
  -  Ticket data
  -  Loading state
  -  Error state
  -  Pagination data
  -  Ticket fetching

### Custom Hooks
Custom hooks encapsulate reusable React logic.
Examples:
  - useTickets() -> Provides access to TicketsContext
  - useDebounce() -> Delays search value updates
  - useForm() -> Manages reusable form state and submission

Custom hooks help keep reusable logic separate from UI components.

### API Layer
The API modules are responsible for communicating with the backend.
  - authApi.js → Authentication requests
  - ticketApi.js → Ticket requests
  - userApi.js → User-related requests

Components do not need to construct HTTP requests directly.
Instead: Component -> Context / API module -> axiosInstance -> Backend

### Axios Instance
`axiosInstance.js` provides a shared Axios configuration.
Its responsibilities include:
  -  Base API URL
  -  Adding JWT authentication headers
  -  Handling unauthorized responses globally

The request interceptor reads the JWT from localStorage and adds:
` Authorization: Bearer <token>` to authenticated requests.

---

## 4. Application Entry Point
The application starts from main.jsx.
The major provider hierarchy is:
```text
StrictMode
   ↓
AuthProvider
   ↓
TicketProvider
   ↓
BrowserRouter
   ↓
Chakra UI Provider
   ↓
App
```

### AuthProvider
Provides authentication state and authentication actions to the application.

### TicketProvider
Provides shared ticket state and ticket-related actions.

### BrowserRouter
Provides client-side routing.

### Chakra UI Provider
Provides the application's UI system and theme configuration.

### App
Acts as the root application component and renders: `Navbar , AppRoutes , Toaster`

---

## 5. Routing Architecture
Application routes are centralized in `AppRoutes.jsx`.
Private routes are grouped under PrivateRoute.
```text
AppRoutes
    │
    ├── PrivateRoute
    │      │
    │      ├── /
    │      ├── /tickets
    │      ├── /tickets/:ticketId
    │      ├── /tickets/:ticketId/edit
    │      └── /create
    │
    ├── /login
    ├── /register
    │
    └── *
         ↓
       NotFound
```
`PrivateRoute` checks the authentication state.
```text
isAuthenticated === null
        ↓
     Loading

isAuthenticated === false
        ↓
   Navigate /login

isAuthenticated === true
        ↓
      Outlet
```
This centralizes route protection instead of requiring every private page to implement authentication checks independently.

---

## 6. Ticket Data Architecture

Ticket-related data follows this flow:
```text
Tickets.jsx
    ↓
useTickets()
    ↓
TicketsContext
    ↓
ticketApi
    ↓
axiosInstance
    ↓
Backend API
    ↓
MongoDB
```
The response travels back through the same layers:
```text
MongoDB
    ↓
Backend
    ↓
Axios
    ↓
ticketApi
    ↓
TicketsContext
    ↓
Tickets.jsx
    ↓
TicketCard
```
`TicketsContext` stores shared ticket data because multiple parts of the application can need access to ticket information.

---

## 7. Form Architecture
Ticket creation and editing use a separation between business logic, reusable form state, and presentation. `CreateTicket / EditTicket` -> `useForm` -> `TicketForm`

### Parent page
Responsible for:
-  Business logic
-  API calls
-  Error handling
-  Navigation
-  Ticket-specific rules

### `useForm`
Responsible for:
-  Form state
-  Updating form fields
-  Preventing default submission
-  Calling the supplied submit function

### `TicketForm`
Responsible for:
-  Rendering fields
-  Displaying form values
-  Handling user input
-  Submitting the form

This separation allows the same form component and form hook to be reused for both creating and editing tickets.

---

## 8. State Management Strategy
The application uses a combination of local component state and Context API.

### Local State
Used when state belongs to a single page or component.

Examples: searchTerm; statusFilter; priorityFilter; sortBy; page; selectedAgent; formData; loading states; Context State.
Used when state needs to be shared across multiple components.
Examples: Authenticated user; Authentication status; Tickets; Ticket loading state; Ticket errors; Pagination data.

The general rule is: 
Local UI state → useState
Shared application state → Context API

---

## 9. Search and Filtering Flow
Search is handled using local state and a debounce hook.
```text
User types
    ↓
searchTerm
    ↓
useDebounce()
    ↓
debouncedValue
    ↓
useEffect()
    ↓
fetchTickets()
    ↓
Backend API
```

Status, priority, sorting, and pagination are also included in the API query.
Example:
```text
GET /tickets
    ?page=1
    &limit=6
    &search=login
    &status=Open
    &priority=High
    &sortBy=createdAt
    &order=desc
```

The backend remains responsible for applying the actual filtering, sorting, and pagination rules.

---

## 10. Overall Data Flow
A typical request follows this architecture:
```text
User Interaction
       ↓
React Component
       ↓
Context / Custom Hook
       ↓
API Module
       ↓
Axios Instance
       ↓
HTTP Request
       ↓
Express Route
       ↓
Middleware
       ↓
Controller
       ↓
Mongoose Model
       ↓
MongoDB
```
The response follows the reverse direction:
```text
MongoDB
   ↓
Mongoose
   ↓
Controller
   ↓
Express Response
   ↓
Axios
   ↓
API Module
   ↓
Context / Component
   ↓
React UI
```

---

## 11. Key Architectural Decisions
### Separate API logic from UI
API requests are kept inside dedicated API modules instead of being written directly inside presentation components.

### Use Context for shared state
Authentication and ticket data are shared through Context rather than being passed through multiple levels of component props.

### Use custom hooks for reusable logic
Reusable React behavior is extracted into hooks such as useForm, useDebounce, and useTickets.

### Protect routes centrally
Private routes are protected through PrivateRoute.

### Keep authorization on the backend
The frontend may hide or show UI based on the user's role, but the backend remains responsible for enforcing authorization rules.

---

## 12. Interview Summary

A concise way to explain the architecture in an interview:

My application follows a client-server MERN architecture. The React frontend is organized into pages, reusable components, Context providers, custom hooks, and API modules. Context is used for shared authentication and ticket state, while local state handles page-specific UI state such as filters and forms. API modules communicate with the Express backend through a shared Axios instance, which also handles JWT authentication headers and global 401 handling. On the backend, requests pass through routes, middleware, controllers and Mongoose models before reaching MongoDB. Authentication is handled using JWT, while role-based authorization is enforced by the backend.
