# Customer Support Ticket Management System

## 1. Project Overview

The Customer Support Ticket Management System is a MERN stack application designed to manage customer support requests through a ticket-based workflow.

The application supports three user roles:

- **Customer** – Creates and tracks support tickets.
- **Agent** – Views and manages assigned tickets.
- **Admin** – Manages tickets, assigns agents, and views dashboard statistics.

The application demonstrates authentication, role-based authorization, REST API communication, MongoDB data management, search, filtering, sorting, pagination, and dashboard aggregation.

---

## 2. Main Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Customer ticket creation
- Ticket search
- Ticket filtering by status and priority
- Ticket sorting
- Server-side pagination
- Ticket details
- Ticket status and priority management
- Agent assignment by admin
- Ticket deletion by admin
- Admin dashboard
- Dashboard statistics and agent-wise ticket information
- Responsive UI
- Light/Dark mode

---

## 3. Technology Stack

### Frontend

- React
- Vite
- React Router
- Chakra UI
- Axios
- Context API
- Custom React Hooks
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- Morgan
- CORS
- dotenv

---

## 4. High-Level Architecture

The application follows a client-server architecture.

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Express + Node.js Backend
      │
      │ Mongoose
      ▼
MongoDB
```
### Frontend flow
```text
Pages / Components
        ↓
Context / Custom Hooks
        ↓
API Modules
        ↓
Axios Instance
        ↓
Backend REST API
```

### Backend flow
```text
HTTP Request
      ↓
Route
      ↓
Middleware
      ↓
Controller
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
HTTP Response
```
---

## 5. User Roles

| Role     | Main Responsibilities                                         |
| -------- | ------------------------------------------------------------- |
| Customer | Create and track own support tickets                          |
| Agent    | View and manage assigned tickets                              |
| Admin    | Manage tickets, assign agents, delete tickets, view dashboard |

The backend is the final authority for authentication and authorization. Frontend role-based rendering is primarily used to control the user interface and navigation.

---

## 6. Project Structure
```text
project-2-customer-support-ticket-system/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Node.js / Express application
│
└── docs/
    └── Project documentation
```

---

## 7. Important Application Flows
### Authentication

```text
Login Page
    ↓
AuthContext
    ↓
authApi
    ↓
Axios Instance
    ↓
POST /users/login
    ↓
Backend
    ↓
JWT + User Data
    ↓
AuthContext
    ↓
localStorage
```

### Fetching Tickets
```text
Tickets Page
    ↓
useTickets()
    ↓
TicketsContext
    ↓
ticketApi
    ↓
Axios Instance
    ↓
GET /tickets
    ↓
Backend
    ↓
MongoDB
    ↓
Ticket Data
    ↓
TicketsContext
    ↓
TicketCard
```

### Creating a Ticket
```text
CreateTicket
    ↓
useForm
    ↓
TicketForm
    ↓
ticketApi.createTicket()
    ↓
POST /tickets
    ↓
Backend
    ↓
MongoDB
```

---

## 8. Documentation

Detailed job-focused documentation is available in the following files:
- [Architecture](./ARCHITECTURE.md)
- [Authentication](./AUTH_FLOW.md)
- [API Flow](./API_FLOW.md)
- [API REFERENCE](./API_REFERENCE.md)
- [Backend Architecture](./BACKEND.md)

 ---

 ## 9. Project Goal
 The project demonstrates practical MERN development concepts including:

-  React component architecture
-  Context API and state management
-  Custom hooks
-  REST API integration
-  Axios interceptors
-  JWT authentication
-  Role-based authorization
-  Express middleware
-  MongoDB and Mongoose
-  Pagination, filtering and sorting
-  Aggregation
-  Error handling
-  Debugging React rendering and API request issues

The project is intended to demonstrate the skills required for an intermediate MERN stack developer role.