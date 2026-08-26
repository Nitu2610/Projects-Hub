# API Reference

## 1. API Architecture

The frontend communicates with the backend through REST APIs.

```text
React
  ↓
API module
  ↓
Axios instance
  ↓
HTTP request
  ↓
Express route
  ↓
Controller
  ↓
MongoDB
```
The frontend API modules are:
```text
src/api/
├── authApi.js
├── ticketApi.js
├── userApi.js
└── axiosInstance.js
```

---

## 2. Authentication APIs

### Register Customer
`POST /users/register`

Purpose -> Creates a new customer account.

Request
```js
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password"
}
```
Frontend
```text
Register.jsx
    ↓
authApi.register()
    ↓
POST /users/register
```

### Login
` POST /users/login`

Purpose ->  Authenticates a user and returns a JWT.

Request
```js
{
  "email": "john@example.com",
  "password": "password"
}
```
Response concept
```js
{
  "token": "<JWT>",
  "user": {
    "_id": "...",
    "firstName": "John",
    "role": "customer"
  }
}
```
Flow
```text
Login.jsx
    ↓
AuthContext.login()
    ↓
authApi.login()
    ↓
POST /users/login
    ↓
Backend authentication
    ↓
JWT + user
```

---

## 3. Ticket APIs
Get Tickets `GET /tickets`

Purpose
Retrieves tickets available to the authenticated user.
The backend determines which tickets the user is allowed to see based on authentication, role and business rules.

Query Parameters page; limit; search; status; priority; sortBy; order

Flow
```text
Tickets.jsx
    ↓
fetchTickets()
    ↓
ticketApi.getTickets()
    ↓
GET /tickets
    ↓
Backend filtering/pagination/sorting
    ↓
MongoDB
    ↓
Response
```

---

## 4. Get Single Ticket - `GET /tickets/:ticketId`

Purpose
Retrieves one ticket using its MongoDB ID.

Example: `GET /tickets/65abc123...`
Frontend
```text
TicketDetails.jsx
    ↓
useParams()
    ↓
ticketId
    ↓
ticketApi.getTicketById(ticketId)
```

---

## 5. Create Ticket - `POST /tickets`

Purpose
Creates a new support ticket.

Request Example
```js
{
  "title": "Unable to login",
  "description": "Login button is not working.",
  "priority": "High",
  "issueOccurredAt": "2026-08-26T10:30:00.000Z"
}
```
Frontend Flow
```text
TicketForm
    ↓
useForm
    ↓
CreateTicket
    ↓
ticketApi.createTicket()
    ↓
POST /tickets
```

Authorization
Only authorized users can create tickets.
The backend remains responsible for enforcing the rule.

---

## 6. Update Ticket - `PATCH /tickets/:ticketId`

Purpose
Updates an existing ticket.
The frontend builds a payload containing only changed fields.

Example:
```js
{
  "status": "Resolved",
  "resolution": "Issue fixed."
}
```

Why PATCH?
PATCH is appropriate because the application can update only selected fields instead of replacing the entire ticket document.

Flow
```text
EditTicket
    ↓
Compare original vs updated data
    ↓
Build PATCH payload
    ↓
ticketApi.updateTicket()
    ↓
PATCH /tickets/:ticketId
```

---

## 7. Delete Ticket -  `DELETE /tickets/:ticketId`

Purpose
Deletes a ticket.

Authorization
The backend restricts this operation to authorized admin users.

Flow
```text
TicketDetails
    ↓
Delete confirmation
    ↓
ticketApi.deleteTicket()
    ↓
DELETE /tickets/:ticketId
    ↓
Backend authorization
    ↓
MongoDB
```

---

## 8. Admin Dashboard API - `GET /tickets/dashboard`

Purpose
Retrieves aggregated ticket statistics for the admin dashboard.
The backend performs aggregation rather than sending all tickets to the frontend for calculation.

Frontend
```text
AdminDashboard
    ↓
ticketApi.getDashboardStats()
    ↓
GET /tickets/dashboard
    ↓
Backend aggregation
    ↓
MongoDB
    ↓
Dashboard statistics
```

---

## 9. User API
Get Users - `GET /users`

Purpose
Retrieves users available to an authorized administrator.
The Edit Ticket page uses this API to retrieve agents for ticket assignment.

Flow
```text
EditTicket
    ↓
userApi.getUsers()
    ↓
GET /users
    ↓
Backend authorization
    ↓
Users
    ↓
Filter users with role = agent
    ↓
Display agents
```

---

## 10. API Authentication

Protected API requests use a JWT.
The shared Axios instance adds: `Authorization: Bearer <JWT>`
through a request interceptor.
```text
API request
    ↓
axiosInstance
    ↓
Read token from localStorage
    ↓
Add Authorization header
    ↓
Backend auth middleware
```

---

## 11. HTTP Methods Used

| Method | Purpose                     |
| ------ | --------------------------- |
| GET    | Retrieve data               |
| POST   | Create data / perform login |
| PATCH  | Partially update data       |
| DELETE | Remove data                 |

Why PATCH instead of PUT?
PATCH is used when only some fields need to be changed.

Example: `{ "status": "Resolved" }`
The remaining ticket fields remain unchanged.

---

## 12. Query Parameters
Query parameters are used for ticket listing operations.

Example: `GET /tickets?page=2&limit=6&status=Open`

They are useful for:
- Pagination
- Search
- Filtering
- Sorting

The backend processes these parameters before querying MongoDB.

---

## 13. Pagination
The ticket list uses server-side pagination.

Example: `page = 1` `limit = 6`

The backend returns only the required records instead of sending every ticket to the frontend.
The response also contains pagination information such as: `current page`  `total pages` `total records`

The frontend uses this information to render pagination controls.

---

## 14. Filtering
Supported ticket filters include: `Status` `Priority` `Search`

Example: `GET /tickets?status=Open&priority=High`

The frontend sends the filter values as query parameters.
The backend converts them into the appropriate database query.

---

## 15. Sorting
The frontend can request different sorting options.

Example: `GET /tickets?sortBy=createdAt&order=desc`

The backend handles sorting before returning the results.

---

## 16. API Error Handling

The application handles errors at multiple levels.

Backend
The backend returns an appropriate HTTP status and message.

Example: `{ "message": "Ticket not found" }

API layer
Axios rejects the request when an HTTP error occurs.

Component
The component can display the backend message: `err.response?.data?.message`

Global 401 handling
The Axios response interceptor handles 401 Unauthorized.
```text
401 response
    ↓
Clear token
    ↓
Clear user
    ↓
Redirect to /login
```

---

## 17. API Responsibility Separation
The frontend does not directly call Axios from every component.

Instead: `Component -> API module -> Axios instance`

For example: `await ticketApi.getTicketById(ticketId);`
instead of: `axios.get("/tickets/" + ticketId);`

This keeps HTTP communication centralized and easier to maintain.

---

## 18. API Summary
| API                  | Method | Purpose              | Authentication |
| -------------------- | ------ | -------------------- | -------------- |
| `/users/register`    | POST   | Register customer    | Public         |
| `/users/login`       | POST   | Login                | Public         |
| `/users`             | GET    | Get users/agents     | Protected      |
| `/tickets`           | GET    | Get tickets          | Protected      |
| `/tickets/:ticketId` | GET    | Get one ticket       | Protected      |
| `/tickets`           | POST   | Create ticket        | Protected      |
| `/tickets/:ticketId` | PATCH  | Update ticket        | Protected      |
| `/tickets/:ticketId` | DELETE | Delete ticket        | Protected      |
| `/tickets/dashboard` | GET    | Dashboard statistics | Protected      |

---

## 19. Simple API Mental Model

Remember:
```text
React
  ↓
API function
  ↓
Axios
  ↓
HTTP
  ↓
Express route
  ↓
Middleware
  ↓
Controller
  ↓
MongoDB
  ↓
Response
  ↓
React state
  ↓
UI
```
---
---
## Interview Questions

- #### What APIs did you build?
- I built REST APIs for authentication, users, tickets and the admin dashboard. The ticket APIs support CRUD operations, while the listing API also supports search, filtering, sorting and server-side pagination.

- ####  Why did you separate API functions from components?

  - I separated API communication from UI components so that components focus on presentation and business flow while API modules handle HTTP communication. This avoids duplicating Axios configuration and makes the API layer easier to maintain.

- #### How does pagination work?

  - The frontend sends page and limit as query parameters. The backend performs pagination at the database query level and returns the required records along with pagination metadata such as total pages. The frontend uses that metadata to control the pagination UI.

- #### Where do you perform filtering and sorting?
  - The frontend captures the user's filter and sorting selections, but the backend performs the actual filtering and sorting. This is important because the backend can process the data efficiently and enforce the application's business rules.

- #### Why do you use PATCH?
  - I use PATCH because the edit operation can modify only selected fields of a ticket. The frontend compares the original and updated data and sends only the changed fields.

- #### How do you secure your APIs
  - Protected requests include a JWT in the Authorization header. The backend authentication middleware verifies the token, and authorization logic checks the user's role and ownership before allowing sensitive operations. Frontend role checks are only for UI behavior; they are not treated as the security boundary.




