# Data Flow

## 1. Overall MERN Data Flow

The application follows this general flow:

```text
React Component
      ↓
Custom Hook / Context
      ↓
API Layer
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
      ↓
Controller
      ↓
HTTP Response
      ↓
API Layer
      ↓
Context / Component State
      ↓
React UI
```
The main idea is to keep responsibilities separated.

-  React components handle UI and user interaction.
-  Context manages shared application state.
-  Custom hooks provide reusable React logic.
-  API modules handle HTTP requests.
-  Axios provides common HTTP configuration.
-  Express handles backend routing and request processing.
-  Controllers contain backend business logic.
-  Mongoose handles MongoDB interaction.
-  MongoDB stores the persistent data.

---

## 2. Frontend Data Flow

The frontend is organized into several layers:
```text
pages / components
       ↓
customHooks / Context
       ↓
api
       ↓
axiosInstance
       ↓
Backend
```
For example, fetching tickets:
```text
Tickets.jsx
    ↓
useTickets()
    ↓
TicketsContext.fetchTickets()
    ↓
ticketApi.getTickets()
    ↓
axiosInstance.get("/tickets")
    ↓
Backend
```

---

## 3. Ticket Fetch Flow

When the Tickets page loads or its filters change:
```text
Tickets.jsx
    ↓
useEffect()
    ↓
Build query parameters
    ↓
fetchTickets(params)
    ↓
TicketsContext
    ↓
ticketApi.getTickets(params)
    ↓
Axios GET /tickets
    ↓
Backend
```

Example query: `GET /tickets?page=1&limit=6&status=Open&priority=High`

The backend processes the request and returns ticket data.
```text
Backend response
      ↓
ticketApi
      ↓
TicketsContext
      ↓
setTicketsData()
      ↓
Tickets.jsx re-renders
      ↓
TicketCard
```

---

## 4. Why Context Is Used for Tickets

Ticket data is shared by multiple parts of the application.

TicketsContext manages:
-  `ticketsData`
-  `loading`
-  `error`
-  `paginationData`
-  `fetchTickets()`

This avoids having every component independently manage the same ticket state.

The Context acts as a shared state layer:
```text
              TicketsContext
             /       |       \
            ↓        ↓        ↓
        Tickets    Create    Other
                   Ticket   Components
```

---

## 5. Custom Hook Flow

`useTickets()` is a wrapper around `useContext()`.

Instead of every component doing: `useContext(TicketsContext)`

components can use: `useTickets()`

Flow:
```text
Component
    ↓
useTickets()
    ↓
TicketsContext
```
The custom hook does not create shared state.

The shared state belongs to TicketsContext.

---

## 6. Search and Debounce Flow

Search is handled using local component state because it controls the UI of the Tickets page.
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
Backend search
```
The debounce prevents an API request from being triggered for every keystroke.

For example:
```text
User types: "printer"

p       → no API request
pr      → no API request
pri     → no API request
prin    → no API request
print   → no API request
printer → request after debounce delay
```

---

## 7. Filter and Pagination Flow

Filters and pagination are kept as local UI state in Tickets.jsx.
```text
User changes filter
       ↓
setStatusFilter()
       ↓
setPage(1)
       ↓
useEffect()
       ↓
Build API query
       ↓
fetchTickets()
       ↓
Backend
```
Example:
```js
{
  page: 1,
  limit: 6,
  status: "Open",
  priority: "High",
  sortBy: "createdAt",
  order: "desc"
}
```
The backend performs filtering, sorting and pagination.

The frontend displays the returned results.

---

## 8. Create Ticket Flow

Creating a ticket follows:
```text
TicketForm
    ↓
useForm
    ↓
CreateTicket
    ↓
ticketApi.createTicket()
    ↓
Axios POST /tickets
    ↓
Backend
    ↓
Create ticket in MongoDB
    ↓
Response
    ↓
CreateTicket
    ↓
fetchTickets()
    ↓
Navigate to Home
```
Responsibilities:

### TicketForm
Handles the form UI.

### `useForm`
Handles generic form state and input changes.

### `CreateTicket`
Handles ticket-specific business logic and API communication.

### `ticketApi`
Handles the HTTP request.

### Backend
Validates, authorizes and persists the ticket.

---

## 9. Edit Ticket Flow

Editing follows:
```text
EditTicket
    ↓
GET /tickets/:ticketId
    ↓
Load original ticket
    ↓
setFormData()
    ↓
TicketForm
    ↓
User changes fields
    ↓
useForm
    ↓
handleUpdateTicket()
    ↓
Compare original vs updated data
    ↓
Build PATCH payload
    ↓
PATCH /tickets/:ticketId
    ↓
Backend
    ↓
MongoDB
```
The frontend sends only the changed fields.

Example:
```js
{
  status: "Resolved",
  resolution: "Issue fixed"
}
```
instead of sending the entire ticket.

The backend still validates the update and checks authorization.

---

## 10. Ticket Details Flow

When the user opens: `/tickets/:ticketId`

React Router provides the ticket ID through `useParams()`.
```text
URL
 ↓
useParams()
 ↓
ticketId
 ↓
TicketDetails
 ↓
ticketApi.getTicketById(ticketId)
 ↓
GET /tickets/:ticketId
 ↓
Backend
 ↓
MongoDB
 ↓
Ticket response
 ↓
setTicket()
 ↓
UI
```
The selected ticket is stored in local component state because it is only needed by the `TicketDetails` page.

---

## 11. Delete Ticket Flow
```text
Delete button
    ↓
handleDelete()
    ↓
User confirmation
    ↓
ticketApi.deleteTicket(ticketId)
    ↓
DELETE /tickets/:ticketId
    ↓
Backend authorization
    ↓
MongoDB delete
    ↓
Success response
    ↓
Navigate to Home
```
The backend is responsible for enforcing that only an authorized admin can delete the ticket.

---

## 12. API Layer Responsibility

API modules provide a separation between React code and HTTP communication.

Example:

- `ticketApi.js`

- `getTickets()`
- `getTicketById()`
- `createTicket()`
- `updateTicket()`
- `deleteTicket()`
- `getDashboardStats()`

Components do not need to know:

-  Axios configuration
-  API base URL
-  HTTP request construction
-  Authorization header implementation

They simply call the required API function.

Example: `await ticketApi.createTicket(ticketData);`

---

## 13. Axios Instance Responsibility

`axiosInstance.js` provides common HTTP configuration.

It handles:
```text
Base URL
     ↓
Request interceptor
     ↓
JWT attachment
     ↓
HTTP request
     ↓
Response interceptor
     ↓
Global 401 handling
```
This prevents authentication logic from being duplicated across every API module.

---

## 14. Backend Data Flow

The backend follows:
```text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Model
     ↓
MongoDB
     ↓
Controller
     ↓
HTTP Response
```
For example:
```text
GET /tickets
     ↓
ticketRoutes
     ↓
authMiddleware
     ↓
ticketController
     ↓
Ticket.find()
     ↓
MongoDB
     ↓
Controller formats response
     ↓
JSON response
```

---

## 15. Request vs Response
### Request

The frontend sends:
```text
URL
HTTP method
headers
query parameters
request body
JWT
```
Example:
```js
PATCH /tickets/123
Authorization: Bearer <token>
Content-Type: application/json
```
Request body:
```js
{
  "status": "Resolved",
  "resolution": "Issue fixed"
}
```
### Response

The backend returns:
```text
HTTP status
JSON data
error message if applicable
```
Example:
```js
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": {
    "id": "123",
    "status": "Resolved"
  }
}
```

---

## 16. Where Business Rules Are Enforced

The frontend can improve user experience by showing or hiding actions.

However, the backend is the final authority.

Example: Frontend -> Hide Delete button for non-admin

But this is not sufficient for security.
The backend must still perform:

Request -> Authentication -> Role authorization -> Business rule validation -> Database operation

This prevents users from bypassing frontend restrictions by manually sending API requests.

---

## 17. Complete Example: Updating a Ticket

A complete request travels through the application like this:
```text
User clicks "Update"
        ↓
TicketForm
        ↓
useForm.handleSubmit()
        ↓
EditTicket.handleUpdateTicket()
        ↓
Compare original and updated values
        ↓
Build PATCH payload
        ↓
ticketApi.updateTicket()
        ↓
axiosInstance.patch()
        ↓
PATCH /tickets/:ticketId
        ↓
JWT sent in Authorization header
        ↓
Express route
        ↓
Authentication middleware
        ↓
Authorization/business rules
        ↓
Ticket controller
        ↓
Mongoose
        ↓
MongoDB
        ↓
Updated document
        ↓
JSON response
        ↓
EditTicket
        ↓
Success notification
        ↓
Navigate to TicketDetails
        ↓
GET updated ticket
        ↓
Display updated UI
```

---

## 18. Key Concepts to Know for Interviews

Be comfortable explaining:

-  Client-server architecture
-  REST API
-  HTTP methods
-  Request and response
-  Query parameters
-  Request body
-  HTTP headers
-  Axios
-  Axios interceptors
-  React Context
-  Custom hooks
-  Local component state vs shared state
-  useEffect
-  API request lifecycle
-  Express routes
-  Middleware
-  Controllers
-  Mongoose models
-  MongoDB
-  Authentication middleware
-  Authorization
-  Pagination
-  Filtering
-  Sorting
-  Debouncing
-  PATCH vs PUT
-   Error handling

---

## 19. Simple Mental Model

Remember the application using this:
```text
        FRONTEND
           │
           ▼
     React Component
           │
           ▼
    Context / Hook
           │
           ▼
       API Layer
           │
           ▼
     Axios Instance
           │
      HTTP Request
           │
           ▼
        BACKEND
           │
           ▼
      Express Route
           │
           ▼
       Middleware
           │
           ▼
       Controller
           │
           ▼
      Mongoose Model
           │
           ▼
        MongoDB
           │
           ▼
      JSON Response
           │
           ▼
        FRONTEND
           │
           ▼
      State Update
           │
           ▼
      React Re-render
```
One-Line Interview Summary 
- My MERN application separates UI, state management, API communication and backend business logic, with data flowing from React through the API layer and Express backend to MongoDB, and the response travelling back to update the React state and UI.
---

#### Explain how data flows through your MERN application.
- I keep the frontend separated into UI, state management and API layers. A React page or component handles user interaction. Shared ticket state is managed through Context, while reusable React behavior is extracted into custom hooks. API modules handle HTTP communication using a shared Axios instance.

- The request then reaches the Express backend, where routes determine the endpoint and middleware handles authentication and authorization. The controller contains the business logic and uses Mongoose models to interact with MongoDB.

- MongoDB returns the data to the controller, which sends a JSON response back to the frontend. The API layer returns the response to the Context or component, state is updated, and React re-renders the UI.



