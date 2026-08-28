# Learning Notes

- #### Redux Toolkit vs RTK Query
  - RTK Query is used to manage server state and API communication, while Redux Toolkit is used for shared client/application state.

- #### Authentication vs Authorization
  - Authentication → Who are you?
  - Authorization → What are you allowed to do?

- #### HTTP-only cookie
  - The authentication token is stored in a cookie that JavaScript cannot directly access. The browser sends it with appropriate requests to the backend.

- #### What architecture have you used?
  - For my MERN projects, I used a Model–Controller–Service architecture on the backend. Controllers handle HTTP requests and responses, services contain business logic, and models handle database interaction. Since React handles the presentation layer on the frontend, we don't use a traditional server-side View layer.

- #### MVC vs MCS
  - MVC has a View layer because the server can generate the presentation. In our MERN REST API, React handles the View, so MCS is a natural backend architecture.

|                | MVC                          | MCS                        |
| -------------- | ---------------------------- | -------------------------- |
| Model          | Data/database                | Data/database              |
| Controller     | Request handling             | Request handling           |
| Service        | Usually not a core layer     | Business logic             |
| View           | Server-rendered UI           | Usually not present        |
| Typical use    | Server-rendered applications | REST APIs/backend services |
| React frontend | Not necessary                | Works very well            |

- #### Why one User model?
  - Both Customer and Admin share common identity information: name, email, password, mobile, role.
  - The `role` determines what the user is allowed to do.

- #### Error propagation
  - The service layer should not depend on Express's next() because it is business logic rather than HTTP middleware. Unexpected errors are thrown from the service, caught by asyncHandler, and forwarded to the centralized error handler.

- #### Validation vs Business Logic
  - Validation middleware → Is the incoming data structurally valid?
  - Service → Is the requested operation allowed/business-valid?

- #### What are asyncHandler and errorHandler, how are they linked, and where are they used?
  - `asyncHandler` → A wrapper around async controllers. It catches errors from the controller and passes them to Express using `next(err)`.
  - `errorHandler` → Central middleware that receives those errors, logs them, and sends the appropriate error response.
  - Link: `Controller throws → asyncHandler catches → next(err) → errorHandler handles`.
  - `asyncHandler` is linked in the route:`asyncHandler(userController.registerCustomer)`
  - `errorHandler` is linked globally in `app.js`, after the routes: `app.use(errorHandler);`
  - `errorHandler` is kept in `middleware/` because it is Express middleware and is common to the entire application, not just users. That's why we don't put it in `user.routes.js`.
  - Remember: `asyncHandler = catches`, `errorHandler = handles`.

- #### How do user.validator, validationResult, and validatorMiddleware work together?
  - `user.validator.js`  → Defines the validation rules for user input, e.g. email must be valid, password must be 8–20 characters.
  - `validationResult(req)` → Collects the validation errors produced by those rules for the current request.
  - `validatorMiddleware` → Checks those results:
    - Errors exist → stop request and return `400`.
    - No errors → call `next()` and continue to the controller.
  - Flow: `user.validator → validationResult(req) → validatorMiddleware → Controller`.  - - Remember: `validator = defines rules`, `validationResult = collects results`, `validatorMiddleware = decides whether to continue`.
  
- ####
  -

- ####
  -

- ####
  -

- ####
  -

- ####
  -
- ####
  -

- ####
  -

- ####
  -

- ####
  -

- ####
  -
- ####
  -

- ####
  -

- ####
  -

- ####
  -

- ####
  -
- ####
  -

- ####
  -

- ####
  -

- ####
  -

- ####
  -
