# Backend Architecture

## Overview

The backend follows a layered architecture where each layer has a
specific responsibility.

The main request flow is:

Client
→ Routes
→ Middleware
→ Controller
→ Service
→ Model
→ MongoDB

Utilities support the service and middleware layers where reusable
logic is required.

---

## Request Flow

```text
Client
  │
  │ HTTP Request
  ▼
Routes
  │
  ▼
Authentication / Authorization / Validation
  │
  ▼
Controller
  │
  ▼
Service
  │
  ├── Utilities
  │
  ▼
Model
  │
  ▼
MongoDB
  │
  ▼
Service
  │
  ▼
Controller
  │
  ▼
HTTP Response
```
---
## Layer Responsibilities
#### 1.  Routes

Responsible for:

Defining API endpoints
Mapping HTTP methods and paths
Applying middleware in the correct order
Connecting routes to controllers

Example:
  ``` 
  POST /tickets
        ↓
  authMiddleware
        ↓
  authorizeRoles("customer")
        ↓
  validateTicket
        ↓
  ticketController.createTicket
  ```
Routes should not contain business logic.

---

#### 2. Middleware

Responsible for processing requests before they reach controllers.

Examples:

- authMiddleware
  - Verifies the JWT
  - Attaches authenticated user information to req.user
- authorizeRoles
  - Checks whether the authenticated user has the required role
- validationMiddleware
  - Handles validation errors produced by express-validator
- asyncHandler
  - Forwards rejected controller promises to centralized error handling

Middleware handles cross-cutting request concerns rather than ticket
business logic.

---

#### 3. Controllers

Responsible for HTTP concerns.

Controllers:

- Read data from req
- Call the appropriate service
- Translate service results into HTTP status codes
- Send JSON responses

Controllers should not contain database queries or complex business rules.

Example:
```
req.params
req.body
req.user
req.query
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
HTTP response
```
---

#### 4. Services

Responsible for ticket business logic and database operations.

Examples:

- Creating tickets
- Retrieving tickets
- Resource-level authorization
- Updating tickets
- Validating status transitions
- Assigning tickets
- Deleting tickets
- Building dashboard statistics

The service layer is where domain-specific rules are enforced.

---

#### 5. Models

Models define the MongoDB document structure using Mongoose.

Current ticket model:
```
Ticket
├── title
├── description
├── issueOccurredAt
├── status
├── priority
├── createdBy
├── assignedTo
└── resolution
```
Relationships:
```
User
  │
  ├── createdBy ──────► Ticket
  │
  └── assignedTo ─────► Ticket
  ```
  ---

  #### 6. Utilities

Utilities contain reusable logic that does not belong directly inside
controllers or services.

Current utilities include:

**Ticket Query Utilities**
```
buildFilter()
buildSort()
buildPagination()
```
Used to convert query parameters into MongoDB query options.

**Ticket Workflow Utility**
`isValidStatusTransition()`

Responsible for validating allowed agent status transitions.

---

 ### Authentication Flow
```
Client
  │
  │ Authorization: Bearer <token>
  ▼
authMiddleware
  │
  ├── Missing token → 401
  │
  ├── Invalid format → 401
  │
  ├── Invalid/expired JWT → 401
  │
  └── Valid JWT
          │
          ▼
      req.user
          │
          ▼
   authorizeRoles()
```
---

#### Ticket Authorization
Authorization is handled at two levels.

#### Route-level authorization
Determines whether a role can access an endpoint.

Example:
```
POST /tickets
→ customer

PATCH /tickets/:ticketId
→ admin / agent

DELETE /tickets/:ticketId
→ admin
```

### Resource-level authorization
The service determines whether the authenticated user can access
a specific ticket.
```
Customer
→ Own tickets

Agent
→ Assigned tickets

Admin
→ All tickets
```
---

### Ticket Update Workflow
``` 
Update Request
      │
      ▼
Find Ticket
      │
      ├── Not Found → NOT_FOUND
      │
      ▼
Check User Role
      │
      ├── Admin
      │     └── Update allowed fields
      │
      └── Agent
            │
            ▼
       Verify assignment
            │
            ▼
       Validate status transition
            │
            ▼
       Validate resolution
            │
            ▼
       Sanitize allowed fields
            │
            ▼
       Update ticket
```
---

### Error Handling Flow
```
Controller / Service
        │
        │ throw / reject
        ▼
asyncHandler
        │
        ▼
next(error)
        │
        ▼
Central Error Middleware
        │
        ▼
HTTP Error Response
```
Expected application errors may also be represented as standardized
service results:
```
{
  success: false,
  code: "NOT_FOUND",
  message: "Ticket not found."
}
```
The controller translates these results into appropriate HTTP responses.

---

### Folder Responsibility
```
server/
│
├── routes/
│   └── ticket.routes.js
│
├── controllers/
│   └── ticket.controller.js
│
├── services/
│   └── ticket.service.js
│
├── models/
│   ├── ticket.model.js
│   └── user.model.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── authorizeRoles.middleware.js
│   ├── validation.middleware.js
│   └── asyncHandler.js
│
├── validators/
│   └── ticket.validator.js
│
└── utils/
    ├── ticketQuery.utils.js
    └── ticketWorkflow.utils.js
```
---

### Design Principle
Each layer should have a clear responsibility:
```
Routes
→ Where does the request go?

Middleware
→ Is the request authenticated, authorized, and valid?

Controller
→ How should HTTP request/response be handled?

Service
→ What should the application do?

Model
→ How is the data stored?

Utility
→ What reusable supporting logic is needed?
```
The goal is separation of concerns without introducing unnecessary
abstraction.
