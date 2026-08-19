# Why It Exists

- ##### Why can't you just store the logged-in user in React state?
  - React state is in-memory and is lost when the page is refreshed. We need some form of persistent authentication mechanism so the application can restore the user's authenticated state after a refresh.

- ##### authApi.js & AuthContext.jsx
  - `authApi.js` - To isolate **HTTP communication** with authentication endpoints.
  - `AuthContext.jsx` - To provide authentication **state** to the React application.

- ##### Why VITE_BASE_URL and not BASE_URL in .env file?
  - For a Vite frontend, variables that you want to access through frontend JavaScript must start with VITE_.
  - Because Vite intentionally exposes only variables with the VITE_ prefix to the browser.

- ##### AuthProvider complete mounting flow
  ```text
    App starts
    ↓
  AuthProvider renders/mounts
    ↓
  App renders
    ↓
  Login renders/mounts
    ↓
  AuthProvider's useEffect runs
  ```

- ##### Explain the complete frontend authentication flow when a user submits the Login form. Starting from the Login.jsx submit event, explain how the credentials travel through the frontend, reach the backend, how the response is handled, where the token/user are stored, how authentication state is updated, and how the user is redirected.
  - The Login page handles the UI and collects credentials. AuthContext owns authentication state and coordinates the login operation. The API layer is responsible only for HTTP communication with the backend. The backend authenticates the user and returns the JWT/user data. AuthContext then persists the authentication data and updates React state.

    ```text
      1. User enters email + password
              ↓
      2. Login.jsx stores them in userCred state
              ↓
      3. handleSubmit() calls login(userCred)
              ↓
      4. AuthContext.login() calls authApi.login()
              ↓
      5. authApi.login() sends POST /login to backend
              ↓
      6. Backend validates email + password
              ↓
      7. Backend generates JWT + returns user data
              ↓
      8. AuthContext receives token + user
              ↓
      9. AuthContext stores token + user in localStorage
              ↓
      10. AuthContext updates user + isAuthenticated state
              ↓
      11. login() completes successfully
              ↓
      12. Login.jsx navigates the user to "/"
  ```
  
- #####  What happens when login fails? & What is the difference between 401 and 403?
  - Axios receives the HTTP error response and throws an error. The error propagates through the API layer and AuthContext to the catch block in the Login component, where an appropriate message is displayed.
  - 401 Unauthorized: Authentication is missing or invalid.
  - 403 Forbidden: User is authenticated but doesn't have permission to perform the requested action.

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 

- ##### 
  - 
#### Current frontend architecture
```
customer-support-ticket-system-frontend/
│
├── src/
│   │
│   ├── main.jsx
│   │     └── Application bootstrap
│   │
│   ├── App.jsx
│   │     └── Application root
│   │
│   ├── routes/
│   │     └── AppRoutes.jsx
│   │           └── Page routing
│   │
│   ├── pages/
│   │     ├── Login.jsx
│   │     ├── Tickets.jsx
│   │     ├── TicketDetails.jsx
│   │     ├── CreateTicket.jsx
│   │     ├── EditTicket.jsx
│   │     └── Home.jsx
│   │
│   ├── components/
│   │     ├── TicketCard.jsx
│   │     ├── TicketForm.jsx
│   │     ├── FilterComp.jsx
│   │     └── ui/
│   │
│   ├── context/
│   │     ├── AuthContext.jsx
│   │     └── TicketsContext.jsx
│   │
│   ├── customHooks/
│   │     ├── useForm.js
│   │     ├── useDebounce.js
│   │     ├── useTickets.js
│   │     └── useTicketById.js
│   │
│   ├── api/
│   │     └── authApi.js
│   │
│   ├── utils/
│   │     ├── filterCompContent.js
│   │     ├── filterFieldResult.js
│   │     ├── formatFieldLables.js
│   │     └── getSortedTickets.js
│   │
│   └── data/
│         └── tickets.js
```

### The important part: how the pieces connect
```
                         App
                          │
                          ▼
                     AppRoutes
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
       Tickets       TicketDetails     CreateTicket
          │               │                │
          │               │                ▼
          │               │           TicketForm
          │               │
          ▼               ▼
      TicketCard      EditTicket
          │               │
          └───────┬───────┘
                  │
                  ▼
             useTickets()
                  │
                  ▼
          TicketsContext
                  │
                  ▼
             Ticket state
```

### Authentication flow
```
Login.jsx
   │
   │ login(credentials)
   ▼
AuthContext
   │
   │ authApi.login()
   ▼
authApi.js
   │
   │ axios.post()
   ▼
Backend
   │
   │ token + user
   ▼
AuthContext
   │
   ├── localStorage.token
   ├── localStorage.user
   │
   ├── user
   └── isAuthenticated
```
And your application starts with:
```
main.jsx
   │
   ▼
AuthProvider
   │
   ▼
TicketProvider
   │
   ▼
BrowserRouter
   │
   ▼
Chakra Provider
   │
   ▼
App
```
That is an important architectural relationship.

---

### Ticket listing flow

```
Tickets.jsx
    │
    ├── searchTerm
    │
    ├── statusFilter
    │
    ├── priorityFilter
    │
    └── sortBy
    │
    ▼
useDebounce()
    │
    ▼
debounced search
    │
    ▼
ticketsData
    │
    ├── search
    │
    ├── filterFieldResult()
    │
    └── getSortedTicket()
    │
    ▼
sortedTickets
    │
    ▼
TicketCard
```

### Ticket details flow
```
/tickets/:id
      │
      ▼
TicketDetails
      │
      ▼
useTicketById
      │
      ├── useParams()
      │
      └── ticketsData.find(...)
      │
      ▼
ticketDetailsWithId
      │
      ├── display
      ├── edit
      └── delete
``` 

### Create ticket flow
```
CreateTicket
      │
      ▼
useForm
      │
      ├── formData
      ├── handleChange
      └── handleSubmit
              │
              ▼
      handleCreateTicket
              │
              ▼
          newTicket
              │
              ▼
        navigate("/tickets")
``` 


### Edit ticket flow

``` 
TicketDetails
      │
      ▼
/tickets/:id/edit
      │
      ▼
EditTicket
      │
      ▼
useTicketById
      │
      ▼
ticketDetailsWithId
      │
      ▼
editedData
      │
      ▼
handleSubmit
      │
      ▼
updatedData
      │
      ▼
setTicketsData()
      │
      ▼
navigate()
```


