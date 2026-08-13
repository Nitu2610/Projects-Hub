# Customer Support Ticket Management System

A full-stack Customer Support Ticket Management System built using the MERN stack.

The system allows customers to create and track support tickets, agents to work on assigned tickets, and administrators to manage users, tickets, assignments, and dashboard statistics.

---

# Project Status

## Current Status

- Backend: ~90% complete
- Backend API implementation: Complete
- Authentication & authorization: Complete
- Ticket CRUD: Complete
- Ticket workflow enforcement: Complete
- Ticket assignment: Complete
- Dashboard statistics: Complete
- Validation & error handling: Complete
- Backend testing: Completed manually using API requests
- Backend deployment: Pending
- Frontend API integration: Pending

The current focus is to deploy and verify the backend before connecting the frontend to the deployed APIs.

---

# Tech Stack

## Backend

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
- nodemon

## Architecture

The backend follows a layered architecture based primarily on:

- Routes
- Controllers
- Services
- Models
- Middleware
- Validators
- Utilities

The project follows an MCS-style structure:

**Model → Controller → Service**

Additional middleware and utility layers are used for authentication, authorization, validation, error handling, query building, and ticket workflow rules.

---

# Backend Folder Structure

```text
customer-support-ticket-system-backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── ticket.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── authorizeRoles.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/
│   │   ├── ticket.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── health.routes.js
│   │   ├── ticket.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── ticket.service.js
│   │   └── user.service.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── ticketQuery.utils.js
│   │   └── ticketWorkflow.utils.js
│   │
│   ├── validators/
│   │   ├── ticket.validator.js
│   │   └── user.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
├── package-lock.json
└── Why_It_Exist.md
```

# User Roles

The system has three roles:

| Role     | Description                                       |
| -------- | ------------------------------------------------- |
| Customer | Creates and views their own tickets               |
| Agent    | Works on tickets assigned to them                 |
| Admin    | Manages users, tickets, assignments and dashboard |

# Authentication

Authentication is implemented using JWT.

## Registration

Customers can register using:

`POST /api/users/register`

The customer role is assigned automatically.

Agents cannot register themselves.

Agents are created by an administrator using:

`POST /api/users/register/agents`

## Password Security

Passwords are never stored as plain text.

The password flow is:

Client Password
↓
bcrypt hashing
↓
Hashed Password
↓
MongoDB

During login, the supplied password is compared against the stored hash using bcrypt.

## Login

`POST /api/users/login`

A successful login returns a JWT containing information required for authorization.

Example JWT payload:

{
id: user.\_id,
role: user.role
}

The token is then sent with protected requests:

`Authorization: Bearer <token>`

## Authentication Middleware

Protected routes pass through the authentication middleware.

The middleware:

Reads the Authorization header.
Checks the Bearer <token> format.
Verifies the JWT.
Decodes the user information.
Stores the decoded user in:
`req.user`

Example:

`req.user = {`
id: "...",
role: "agent"
};

If the token is missing, invalid, or expired, the request is rejected with:

401 Unauthorized

## Role Authorization

Authentication and authorization are handled separately.

# Authentication

Answers:

Who are you?

Authorization

Answers:

Are you allowed to perform this operation?

The authorizeRoles middleware checks whether the authenticated user's role is allowed to access a route.

Example:

`authorizeRoles("admin", "agent")`

A user with an unauthorized role receives:

403 Forbidden

# Ticket Model

Each ticket contains information such as:

{
title,
description,
issueOccuredAt,
status,
priority,
createdBy,
assignedTo,
resolution,
createdAt,
updatedAt
}

## Status

Tickets use the following statuses:

Open
In Progress
Resolved
Closed

## Priority

Tickets use:

Low
Medium
High
Critical

## Ticket Relationships

Tickets reference users using MongoDB ObjectIds.

Ticket
├── createdBy → User
└── assignedTo → User

This allows the application to determine:

Who created the ticket
Which agent is responsible for the ticket

Mongoose populate() is used when user information needs to be returned with ticket information.

# Ticket Permissions

## Customer

Customers can:

- Create tickets
- View their own tickets

Customers cannot:

- View other customers' tickets
- Update tickets
- Assign tickets
- Delete tickets
- Change ticket status

## Agent

Agents can:

- View tickets assigned to them
- Update assigned tickets
- Change allowed ticket fields
- Change ticket status according to the workflow
- Add/update resolution
- Change priority

Agents cannot:

- Modify tickets assigned to another agent
- Assign tickets
- Delete tickets
- Replace tickets
- Access admin functionality

## Admin

Admins can:

- View all tickets
- Update tickets
- Replace tickets
- Delete tickets
- Assign tickets to agents
- Create agents
- Access dashboard statistics
- Manage the system at an administrative level

# Ticket Workflow

The ticket lifecycle is intentionally restricted.

The allowed agent transitions are:

Open
↓
In Progress
↓
Resolved
↓
Closed

Agents cannot arbitrarily change the status.

For example:

Open → Resolved

is rejected.

Similarly:

Resolved → Open

is rejected.

The workflow is represented using:

`const allowedAgentTransitions = {`
Open: ["In Progress"],
"In Progress": ["Resolved"],
Resolved: ["Closed"],
Closed: []
};

The transition is checked using:

`allowedAgentTransitions[currentStatus].includes(requestedStatus)`

This keeps business rules separate from the controller/service logic.

# Resolution Requirement

A ticket cannot move to:

Resolved

without a valid resolution.

The service checks both:

The resolution supplied by the client
The existing resolution stored on the ticket

The effective resolution is determined using:

`const resolution =`
checkClientResolution !== undefined
? checkClientResolution
: ticket.resolution;

This allows the following behavior:

| Client Resolution | Existing Resolution | Result   |
| ----------------- | ------------------- | -------- |
| Missing           | Missing             | Rejected |
| Empty             | Missing             | Rejected |
| Valid             | Missing             | Accepted |
| Missing           | Valid               | Accepted |
| Valid             | Valid               | Accepted |

The important rule is:

When moving a ticket to Resolved, there must be a valid resolution either already stored on the ticket or supplied by the client.

# Agent Update Rules

Agents are only allowed to update:

[
"status",
"priority",
"resolution"
]

Any other fields sent by the client are ignored.

The service filters the incoming request before updating the database.

Example:

`const filteredData = {};`

for (const field of allowedFields) {
if (updatedData[field] !== undefined) {
filteredData[field] = updatedData[field];
}
}

This prevents agents from modifying protected fields such as:

createdBy
assignedTo
Other ticket properties

## Empty Update Protection

If the client sends no valid agent-update fields, the request is rejected.

The service checks:

`Object.keys(filteredData).length`

If the result is 0:

NO_VALID_FIELDS

is returned.

This prevents unnecessary database update operations.

# Ticket Query Features

The ticket listing API supports:

Role-based filtering
Status filtering
Priority filtering

## Search

## Sorting

## Pagination

Query-building logic is separated into:

ticketQuery.utils.js

## Role-Based Ticket Filtering

The ticket query automatically changes based on the authenticated user's role.

## Customer

`filter.createdBy = userId;`

Customers only receive tickets created by themselves.

## Agent

`filter.assignedTo = userId;`

Agents only receive tickets assigned to them.

## Admin

Admins can access all tickets.

## Search

Ticket search currently operates on the title field.

Example:

`GET /api/tickets?search=payment`

The search uses MongoDB regular expressions with case-insensitive matching.

{
title: {
$regex: search,
$options: "i"
}
}

## Sorting

Supported sorting fields:

createdAt
updatedAt
priority
status

Example:

`GET /api/tickets?sortBy=createdAt&order=desc`

Only whitelisted fields are accepted.

This prevents arbitrary client input from being directly used as a database sort field.

## Pagination

Pagination uses:

page
limit

Example:

`GET /api/tickets?page=2&limit=10`

The service calculates:

`skip = (page - 1) * limit;`

A maximum limit of 100 is enforced.

# Validation

Request validation is implemented using express-validator.

Validation is separated from controllers and services.

Current validation includes:

User Registration

- First name
- Last name
- Email
- Password

## Login

- Email
- Password
  Ticket Creation
- Title
- Description
- Issue occurrence date

## Validation Flow

The request follows this flow:

Client Request
↓
Route
↓
Validation Rules
↓
Validation Middleware
↓
Controller
↓
Service
↓
Database

If validation fails, the request returns:

400 Bad Request

along with the validation errors.

# Error Handling

A global error middleware is used to handle unexpected errors.

The project also uses an asyncHandler utility to avoid repeating try/catch blocks around asynchronous controllers.

Example flow:

Async Controller
↓
asyncHandler
↓
Error
↓
next(error)
↓
Global Error Middleware

This keeps controllers cleaner and centralizes unexpected error handling.

# HTTP Status Codes

The API uses HTTP status codes according to the type of result.

Common examples:

| Status | Meaning                                                                             |
| ------ | ----------------------------------------------------------------------------------- |
| 200    | Successful request                                                                  |
| 201    | Resource created                                                                    |
| 400    | Bad request                                                                         |
| 401    | Authentication required / invalid authentication                                    |
| 403    | Authenticated but not authorized                                                    |
| 404    | Resource not found                                                                  |
| 422    | Request is syntactically valid but cannot be processed because of the provided data |

Examples from ticket operations:

INVALID_STATUS_TRANSITION → 400
RESOLUTION_REQUIRED → 422
NO_VALID_FIELDS → 400
AGENT_NOT_FOUND → 404
TICKET_NOT_FOUND → 404
NOT_AN_AGENT → 400

# Dashboard

The backend provides an admin-only dashboard endpoint.

The dashboard currently calculates:

Total ticket count
Tickets by status
Tickets by priority
Tickets by agent

The dashboard uses MongoDB aggregation pipelines.

## MongoDB Aggregation

The dashboard demonstrates the use of MongoDB aggregation operators such as:

$group
$lookup
$unwind
$project
$sort

For example, tickets can be grouped by status:

{
$group: {
_id: "$status",
count: { $sum: 1 }
}
}

Agent ticket statistics use $lookup to connect ticket assignment information with the users collection.

# API Endpoint Overview

## User APIs

| Method | Endpoint                     | Access |
| ------ | ---------------------------- | ------ |
| POST   | `/api/users/register`        | Public |
| POST   | `/api/users/login`           | Public |
| GET    | `/api/users`                 | Admin  |
| POST   | `/api/users/register/agents` | Admin  |

## Ticket APIs

| Method | Endpoint                        | Access        |
| ------ | ------------------------------- | ------------- |
| GET    | `/api/tickets`                  | Authenticated |
| GET    | `/api/tickets/:ticketId`        | Authenticated |
| POST   | `/api/tickets`                  | Customer      |
| PATCH  | `/api/tickets/:ticketId`        | Agent / Admin |
| PATCH  | `/api/tickets/:ticketId/assign` | Admin         |
| PUT    | `/api/tickets/:ticketId`        | Admin         |
| DELETE | `/api/tickets/:ticketId`        | Admin         |
| GET    | `/api/tickets/dashboard`        | Admin         |

The exact base URL depends on the environment in which the backend is deployed.

# API Request Flow

A typical protected ticket request follows this architecture:

Client
↓
Route
↓

## Authentication Middleware

↓
Role Authorization Middleware
↓
Validation Middleware
↓
Controller
↓
Service
↓
Model / MongoDB
↓
Service
↓
Controller
↓
Client

Not every endpoint uses every middleware layer.

The middleware is applied according to the requirements of each route.

# Why MCS Architecture?

The project separates responsibilities between different layers.

## Routes

Responsible for:

Defining endpoints
Connecting middleware
Connecting controllers

## Controllers

Responsible for:

Receiving HTTP requests
Extracting request data
Calling services
Converting service results into HTTP responses

## Services

Responsible for:

Business logic
Database operations
Permission-related business rules
Ticket workflow logic

## Models

Responsible for:

MongoDB schema definition
Data structure
Mongoose validation

This separation makes the application easier to understand, test, and maintain.

# Environment Variables

The backend uses environment variables for configuration.

Example:

`PORT=5000`
`MONGO_URI=your_mongodb_connection_string`
`JWT_SECRET=your_secret_key`

The .env file must never be committed to Git.

# Running the Backend Locally

Navigate to the backend directory:

`cd customer-support-ticket-system-backend`

Install dependencies:

`npm install`

Create a .env file:

`PORT=5000`
`MONGO_URI=your_mongodb_connection_string`
`JWT_SECRET=your_secret_key`

Start the development server:

`npm run dev`

Start the production server:

`npm start`

# Security Considerations

The backend currently implements several basic security practices:

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Environment variables for secrets
- Request validation
- Restricted update fields
- Whitelisted sorting fields
- Ownership checks
- Ticket assignment checks
- Protected admin routes
- .env excluded from Git

# Testing

Backend APIs were manually tested during development.

Testing focused on:

## Registration

## Login

# Authentication

- Role authorization
- Ticket creation
- Ticket retrieval
- Ticket ownership
- Ticket assignment
- Agent updates
- Status transitions
- Resolution requirements
- Invalid requests
- Forbidden operations
- Dashboard access
- Error responses

The ticket workflow was specifically tested against valid and invalid status transitions.

Example:

Open → In Progress ✓
In Progress → Resolved ✓
Resolved → Closed ✓

Open → Resolved ✗
Resolved → Open ✗
Closed → Open ✗

# Current Backend Limitations

The current backend is intentionally focused on the core functionality required for the project.

Potential future improvements include:

- Automated API test suite
- Improved centralized error classes
- More detailed logging
- Rate limiting
- Refresh tokens
- Email notifications
- Ticket comments
- File attachments
- Advanced search
- Better dashboard analytics
- Automated API documentation using Swagger/OpenAPI

# Deployment

Backend deployment is the next major step.

The deployment process will include:

Configure production environment variables.
Deploy the Node.js/Express backend.
Connect the deployed application to MongoDB.
Verify the health endpoint.
Test authentication.
Test protected APIs.
Verify ticket workflow.
Verify dashboard APIs.
Store the deployed API base URL.
Connect the frontend to the deployed backend.

# Learning & Interview Documentation

The project contains a separate file:

Why_It_Exist.md

This file contains explanations of important implementation decisions and interview-oriented questions.

Examples include:

Why JWT?
Why bcrypt?
Why middleware?
Why separate controller and service layers?
Why use Mongoose?
Why use aggregation?
Why use $lookup?
Why use asyncHandler?
Why validate requests?
Why whitelist update fields?
Why enforce ticket status transitions?
Why use role-based authorization?
Why separate authentication from authorization?

The purpose of this file is to help explain the reasoning behind the implementation rather than simply remembering the code.

# Git Milestones

Important development milestones are committed separately so that the project history reflects the evolution of the application.

A major recent milestone:

`feat: enforce ticket workflow and agent update rules`

This milestone introduced:

- Ticket status transition validation
- Agent update restrictions
- Resolution requirements
- Invalid field protection
- Ticket workflow enforcement

# Project Goals

The main goals of this project are:

- Build a realistic MERN backend rather than a simple CRUD application.
- Practice authentication and authorization.
- Implement role-based access control.
- Implement business rules.
- Work with MongoDB relationships.
- Practice aggregation pipelines.
- Follow a maintainable backend architecture.
- Handle validation and errors correctly.
- Build APIs that can be consumed by a React frontend.
- Deploy the backend and make it production-accessible.

# Future Frontend Integration

The frontend will consume the backend APIs after deployment.

The frontend will eventually provide interfaces for:

## Customer

- Register

## Login

- Create ticket
- View own tickets
- Track ticket status

## Agent- Login

- View assigned tickets
- Update ticket priority
- Update ticket status
- Add resolution

## 

## Admin-  Login

- View all tickets
- Assign tickets
- Create agents
- Manage tickets
- View dashboard statistics

# Author

Built as part of my MERN Stack / Full Stack Web Development upskilling journey.

The project focuses on understanding backend architecture, authentication, authorization, database operations, business logic, and real-world API development rather than only completing CRUD operations.
