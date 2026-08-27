# Why It Exists

- ##### Why can't you just store the logged-in user in React state?
  - React state is in-memory and is lost when the page is refreshed. We need some form of persistent authentication mechanism so the application can restore the user's authenticated state after a refresh.

- ##### authApi.js & AuthContext.jsx
  - `authApi.js` - To isolate **HTTP communication** with authentication endpoints.
  - `AuthContext.jsx` - To provide authentication **state** to the React application.

- ##### Why VITE_BASE_URL and not BASE_URL in .env file?
  - For a Vite frontend, variables that you want to access through frontend JavaScript must start with VITE\_.
  - Because Vite intentionally exposes only variables with the VITE\_ prefix to the browser.

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

- ##### What happens when login fails? & What is the difference between 401 and 403?
  - Axios receives the HTTP error response and throws an error. The error propagates through the API layer and AuthContext to the catch block in the Login component, where an appropriate message is displayed.
  - 401 Unauthorized: Authentication is missing or invalid.
  - 403 Forbidden: User is authenticated but doesn't have permission to perform the requested action.

- ##### When an Axios request fails, start with:
  - console.log("ERROR:", error);
  - console.log("STATUS:", error.response?.status);
  - console.log("DATA:", error.response?.data);
    - Then inspect deeper based on the backend response structure.

- ##### Why did you use useCallback here? Is it necessary?
  - useCallback memoizes the handleChange function so React doesn't create a new function reference on every render. However, in this particular case, it may not provide any meaningful performance benefit because the function is simple and there is no evidence that its changing reference is causing unnecessary re-renders.

  - If I'm using handleChange only within the same component, I would generally write it without useCallback:

  ```js
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  ```

- ##### When would useCallback actually make sense?
  - useCallback isn't automatically a performance improvement. It is useful when referential equality matters, such as when passing callbacks to memoized child components.

- ##### All hook should be called before conditional rendering.
  -

- ##### WHen sending query data to backend, via fetching ticket, how does it work.
  -

- ##### Your React app is making the same API request multiple times. You discover that a component's useEffect is repeatedly executing. How would you debug and fix it?
  - First, check whether the component is re-rendering or unmounting and mounting again.
  - Add logs:

    ```jsx
        console.log("RENDER");
        export const compName:{
        useEffect(() => {
          console.log("MOUNT");

          return () => console.log("UNMOUNT");
        }, []);

        rest of the code ... }
    ```

  - In my case, Tickets was repeatedly unmounting and mounting. I traced the parent component and found:  
     `if (loading) return <Loading />; 
return <Tickets />; `
  - `Tickets` called `fetchTickets()`. `fetchTickets()` called: `setLoading(true);`
  - `loading=true` caused the parent to stop rendering `<Tickets />`. Therefore `Tickets` unmounted. After the API completed: `setLoading(false);`
  - The parent rendered `<Tickets />` again.
  - A new Tickets instance mounted, so its `useEffect` ran again.
  - This created a fetch → loading → unmount → mount → fetch cycle.
  - The fix was to let Tickets remain mounted and handle its own loading UI.
  - **A re-render does not destroy component state, but an unmount destroys the component instance and its local state.**

- ##### What concepts should I know in every project for debugging?
  - You don't need to memorize everything. For every React/MERN project, understand these areas:
    - **React**
      - Component hierarchy
      - Props
      - State
      - Context
      - useState
      - useEffect
      - useContext
      - useCallback
      - useMemo
      - Component render vs re-render vs mount vs unmount
      - Conditional rendering
      - React Router
      - Parent-child relationship
  - **State**
    - For every state ask:
    - Who owns it?
    - Who changes it?
    - Who consumes it?
    - What happens when it changes?
  - **API**
    - Know

      ```text

      Component
        ↓
      Context / Hook
        ↓
      API function
        ↓
      Axios
        ↓
      Express route
        ↓
      Controller
        ↓
      Service
        ↓
      MongoDB
      ```

  - And reverse:
    ```text
    MongoDB
      ↓
    Service
      ↓
    Controller
      ↓
    Response
      ↓
    Axios
      ↓
    Context state
      ↓
    Component
    ```
  - **Browser Debugging**
    - Know how to use:
      - Console
      - Network tab
      - React DevTools
      - Breakpoints / debugger
      - Request payload
      - Response
      - HTTP status codes
      - Call stack

- ##### Debugging Steps
  - Use this sequence. 
    - Step 1 — Clearly define the problem
      Example: "GET /tickets is being called 10 times."
      Don't start changing code yet. 
    - Step 2 — Find where it starts
      Search: `getTickets( ` & `fetchTickets(` 
    - Step 3 — Check the component
      Add: `console.log("RENDER");` 
    - Step 4 — Check mount/unmount
      ```jsx
        useEffect(() => {
        console.log("MOUNT");
        return () => console.log("UNMOUNT");
        }, []);
      ``` 
    - Step 5 — Check state
      ```jsx
      console.log({
      page,
      loading,
      isAuthenticated
      });
      ```
    - Step 6 — Check useEffect
      Look at: `[page, isAuthenticated, fetchTickets] `
      - Ask:
        - Did page change?
        - Did isAuthenticated change?
        - Did fetchTickets change?
    - Step 7 — Trace state ownership  
        - Ask:
          - Who owns loading?
          - Who changes loading?
          - Who consumes loading?
    - Step 8 — Check component tree
        - Ask:
          - Is some parent conditionally removing my component?
    - Step 9 — Check Network
        - Confirm: 
          - How many requests?
          - What URL?
          - What parameters?
          - What response?
    - Step 10 — Fix the cause, not the symptom
        - Don't immediately:
           - remove dependency
           -  disable StrictMode
           -  add random boolean
        - First find why it's happening.

- ##### What does useCallback do? Why does that matter in your useEffect?
  - useCallback memoizes a function reference.
  - 

- ##### What is the difference between render and mount?
  - Mount: component is created and inserted into the React tree.
  - Render: component function executes to calculate JSX.
  - A component can render many times without unmounting.
  - Unmount means the component is removed/destroyed.

- ##### Does state update immediately re-render the component?
  - setState schedules a state update.
  - React may batch multiple updates together.
  - React then renders with the new state.
  - In modern React, many updates are automatically batched.

- ##### Does every Context state update re-render every component in the application?
  - No. A component consuming that Context can re-render when the Context value it receives changes.
  - But components that don't consume that Context don't automatically re-render just because that Context changed.

- ##### Why shouldn't I put every state in Context?
  - Because Context is best for shared state.
  - Local UI state should usually stay local.

- ##### What happens when a component unmounts?
  - Its local state is destroyed.
  - Its effects are cleaned up.
  - When mounted again, its state initializes again.
  - Mount effects execute again.
 
- ##### The Core React Debugging Formula
   ```text
    STATE
      ↓
    STATE UPDATE
      ↓
    RENDER
      ↓
    React compares UI
      ↓
    DOM/component tree changes
      ↓
    EFFECTS RUN
  ```
 -  But always remember: ` RENDER ≠ MOUNT ` and  `RE-RENDER ≠ REMOUNT` That distinction solved your entire bug.

- ##### Understand the Toaster concept and its working flow?
  -

- ##### Understand the concept of loading, loadingText in buttons?
  -

- ##### CharkaLink for styling, and RouterLink for routing.
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
│ │
│ ├── main.jsx
│ │ └── Application bootstrap
│ │
│ ├── App.jsx
│ │ └── Application root
│ │
│ ├── routes/
│ │ └── AppRoutes.jsx
│ │ └── Page routing
│ │
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Tickets.jsx
│ │ ├── TicketDetails.jsx
│ │ ├── CreateTicket.jsx
│ │ ├── EditTicket.jsx
│ │ └── Home.jsx
│ │
│ ├── components/
│ │ ├── TicketCard.jsx
│ │ ├── TicketForm.jsx
│ │ ├── FilterComp.jsx
│ │ └── ui/
│ │
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ └── TicketsContext.jsx
│ │
│ ├── customHooks/
│ │ ├── useForm.js
│ │ ├── useDebounce.js
│ │ ├── useTickets.js
│ │ └── useTicketById.js
│ │
│ ├── api/
│ │ └── authApi.js
│ │
│ ├── utils/
│ │ ├── filterCompContent.js
│ │ ├── filterFieldResult.js
│ │ ├── formatFieldLables.js
│ │ └── getSortedTickets.js
│ │
│ └── data/
│ └── tickets.js

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

```

```
