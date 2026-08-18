# Why It Exist:->

- ##### Why keep app.js and server.js separate?
  - Answer:
    - app.js configures the application (middlewares, routes). How my servre should work or behave.
    - server.js starts the server.
    - This separation makes testing and maintenance easier.

- ##### what is process?
  - Node creates a global object called process when your application starts. It contains information about the current Node.js process.
  - Some commonly used properties are:
    - `process.env      // Environment variables `
    - `process.argv     // Command-line arguments`
    - `process.cwd()    // Current working directory`
    - `process.exit()   // Stop the application`
- ##### What is process.env?
  - It is an object that stores environment variables.
  - `const PORT= process.env.PORT || 5000;` here 'process.env' is a object which hold the environmental variables.
  - 'PORT' is a property or field name from the above object. If not found, consider '5000' as the port.

- ##### What does dotenv do?
  - Without dotenv, Node.js does not automatically read your .env file.
  - When you write: `require("dotenv").config(); `
    - dotenv:
      - Opens the .env file.
      - Reads all the key-value pairs.
      - Stores them inside process.env.
- ##### Why not write this instead?
  - Different environments may require different ports:
    - Local machine → 5000
    - Testing → 3000
    - Production → 8080
    - Cloud platforms (like Render or Railway) → they assign the port automatically.

- ##### Why do we use .env files?
  - To keep configuration separate from application code.
  - To avoid hardcoding environment-specific values like ports, database URLs, and secrets.
  - So the same codebase can run in development, testing, and production with different configurations.

  - ##### Why connect before app.listen() or why databse to start before server?
    - If your server still starts:
      - Users can send requests.
      - Your controllers try to read/write data.
      - Every request fails. Instead, we follow this pattern: - No database → No server.

- ##### Why do we need CORS?
  - A: Browsers block cross-origin requests by default for security. CORS allows trusted origins to access the backend.

- ##### .env file rule
  - `PORT=5000` PORT field name, = assigned, 5000 is value.
  - No Semicolon, No space after `=`.

- ##### Why the line, must be at the start of server file, `require("dotenv").config(); `
  - It reads all the .env file, parsed all the key-value paris, adds them to global variable.
  - As it is at the start , it will add the key - value data to global object ( process), whose value are used to connect with database.

- ##### Why to use "dev" with monrgan i.e morgan("dev")
  - Morgan is used to log the incoming client request details.
  - Morgan supports several predefined log formats. Common ones include:
    - "dev" – Short, color-coded logs (best for development).
    - "tiny" – Minimal information.
    - "combined" – Apache-style detailed logs.
    - "common" – Standard Apache format.
    - "short" – Concise logs with a bit more detail than "tiny".

- ##### Why use enum?
  - To restrict a field to predefined values and prevent invalid data from being stored.

- ##### mongoose Methods for CRUD
  - Create `await Ticket.create(ticketData);`,
    Equivalent MongoDB operation: `db.tickets.insertOne(ticketData);`

  - Read :
    - Get all tickets:
      `await Ticket.find();`
      Equivalent:
      `db.tickets.find({});`

  - Find one ticket:
    `await Ticket.findOne({ priority: "High" });` ,
    Equivalent:
    `db.tickets.findOne({ priority: "High" });`

  - Find by ID:
    `Find by ID:` ,
    Equivalent:
    `db.tickets.findOne({ _id: id });` .
  - Update
    - Update one document:
      `await Ticket.updateOne( { _id: id }, { priority: "Low" });`
      Equivalent:
      `db.tickets.updateOne( { _id: id }, { $set: { priority: "Low" } });`
    - Update and return the updated document:
      ` await Ticket.findByIdAndUpdate( id, { priority: "Low" }, { new: true });`

  - Delete
    - Delete one:` await Ticket.deleteOne({ _id: id });`
      Equivalent:` db.tickets.deleteOne({ _id: id });`
    - Delete by ID: ` await Ticket.findByIdAndDelete(id);`
      Equivalent:`db.tickets.deleteOne({ _id: id});`

- ##### Why use findById() instead of findOne({ _id: id })?
  - findById() is a convenience method specifically for searching by _id. Internally, it's equivalent to findOne({ _id: id }), but it's shorter, clearer, and the preferred choice when you already have the document's ID.
  - Returns Document / null / Throws a CastError if the ID format is invalid.

- ##### Why create a separate filter object instead of passing req.query directly to find()?
  - req.query can contain parameters that are not database fields, such as page, limit, sortBy, or order. By building a separate filter object, we include only the fields intended for filtering, preventing incorrect database queries and making the API easier to extend.

- ##### Why do we hash passwords instead of encrypting them?
  - Passwords don't need to be recovered by the server. During login, the server hashes the password entered by the user and compares it with the stored hash. Since hashing is one-way, storing hashes is more secure than storing reversible encrypted passwords.

- ##### Why is JWT called stateless?
  - Because the server does not store login sessions. Each request contains the information needed to identify the user through the token.
  - JWT proves that the request comes from an authenticated user. The id tells us who that user is, and the role tells us what they're allowed to do.

- ##### Does JWT encrypt data?
  - No. This is one of the most common misconceptions. JWT is signed, not encrypted.
Anyone who has the token can decode its header and payload. The signature ensures the data hasn't been modified. Never put sensitive information like passwords inside a JWT.

- ##### Why don't we store the password inside the JWT?
  - The password is only used once during login to verify the user's identity. After successful authentication, it has no further purpose. Since JWTs can be decoded by anyone who possesses them (they are signed, not encrypted), storing a password inside a JWT would expose sensitive information. Instead, the token contains only the minimum information needed to identify the user.

- ##### Why do we send JWT in the Authorization header instead of the request body?
    - Because authentication credentials are metadata about the request, not part of the application data. HTTP defines the Authorization header specifically for sending credentials, and using the standard Bearer <token> format allows clients, servers, proxies, and libraries to work together consistently.

- ##### Why do we store the decoded payload in req.user instead of making every controller call jwt.verify()?
  - Because authentication should happen once in the middleware. Controllers should focus only on business logic, while middleware provides trusted user information through req.user.

- ##### jwt.verify() working?
  1. Split the token in Header, Payload, and Signature.
  2. Decode the Header to know which algorithim was used.
  3. Decode the Payload
  4. Recreate the signature, using the same secret key on the server.
  5. Compare the signatures,
     - if matched,
        6. Check expiration,
          -  if expired, throws a error `TokenExpiredError`.
          -  if not expired, return the decoded payload. 
     - if not matched, throw an error(exception)
  
  - As its return an exception, we need to use try_catch to handle the error.      

- ##### I understand that Express middleware only receives req, res, and next. So why do we wrap the middleware inside another function like authorize(...roles)? Why can't we pass custom parameters directly to the middleware?

  - After `authMiddleware` runs, Express moves to `authorize("customer", "admin")`.
  - `authorize` is a **regular function**. It accepts the roles that are allowed to access the route. It then **returns a middleware function**.

  - When a request comes in, Express executes that returned middleware. Inside it, we check `req.user.role` against the allowed roles. If the role is allowed, we call `next()`. Otherwise, we return a `403 Access Denied` response.

  - We cannot pass custom parameters like `"customer"` or `"admin"` directly to a middleware because Express only calls middleware with three arguments: `req`, `res`, and `next`.

  - That's why we use a regular function first. It accepts our custom parameters and returns a middleware that remembers those parameters and performs the role check.


- ##### Can you explain the complete validation workflow for the POST /users/register endpoint? Walk me through what happens from the moment the client sends the request until the final response is returned. Explain the role of the route, validation middleware, validationResult(req), controller, service layer, and how the flow changes when validation fails versus when it succeeds.
    - When the client sends a POST /users/register request, Express matches the route and executes the middleware in order. First, validateRegister validates and sanitizes each input field and stores the results in the request. Then validationMiddleware calls validationResult(req) to collect any validation errors. If errors exist, it returns a 400 Bad Request response and the controller is never executed. If validation passes, next() transfers control to the controller, which calls the service layer. The service performs business logic such as checking duplicate emails, hashing the password, saving the user, and generating a JWT. Finally, the controller sends the HTTP response back to the client.

- ##### While implementing role-based authorization for the GET /tickets/:id endpoint, I encountered an issue where a customer was receiving a FORBIDDEN response even though they were the ticket creator. The problem was caused by the following line:
`if (ticket.createdBy.toString() === user.id)`
Can you explain why this comparison failed and how you fixed it?

  -  The issue occurred because I was using `populate()`. After population, `createdBy` became a complete User document instead of an `ObjectId`. I was comparing `ticket.createdBy.toString()` with `user.id`, which always failed. The fix was to compare the populated document's `_id ` using either `ticket.createdBy._id.toString() === user.id` or, preferably, `ticket.createdBy._id.equals(user.id)`. This allowed the authorization check to work correctly.

- ##### What is populate() in Mongoose?
  - `populate()` is a Mongoose method used to fetch related documents referenced by an `ObjectId`. Instead of returning only the `ObjectId`, it replaces that ObjectId with the corresponding document from the referenced collection. It works based on the `ref` property defined in the schema.

- ##### How does populate() work internally?
  - First, Mongoose executes the main query, for example `Ticket.findById(id)`. The returned document contains `ObjectIds` for fields like `createdBy` and `assignedTo`. Mongoose then checks the schema and sees that these fields have a `ref: "User"`. Using that information, it queries the `User` collection for the matching `ObjectIds`. Finally, it replaces the `ObjectIds` with the fetched user documents before returning the final result.

- ##### Is populate() a MongoDB feature?
  - No. `populate()` is a Mongoose feature, not a MongoDB feature. MongoDB stores only the `ObjectId` references. Mongoose performs the additional queries and combines the data before returning it to the application.

- ##### Why do we use ObjectId references instead of storing the complete user information inside every ticket?
  - Using ObjectId references avoids data duplication. User information is stored only once in the User collection. If a user updates their email or name, we update only one document instead of every ticket. This keeps the database consistent and reduces storage usage.

- ##### Why didn't you store firstName, lastName, and email in your Ticket collection?
  - I initially did, but after introducing relationships, I removed them. The ticket now stores only `createdBy` and `assignedTo` as `ObjectId` references. Whenever user information is needed, I use `populate()` to fetch it. This avoids duplication and follows a normalized database design.

- ##### Can we limit the fields returned by populate()?
  - Yes. The second argument of populate() lets us select specific fields. For example: `.populate("createdBy", "firstName lastName email")`. This returns only the selected fields instead of the complete user document, which is both more secure and more efficient.

- #####  Does populate() always improve performance?
  - No. While `populate()` makes development easier, it performs additional database lookups. If we populate many fields or large datasets unnecessarily, it can slow down the application. That's why we should populate only the fields required by the client.

- ##### MVC vs MCS
  - MVC (Model - View - Controller)
    - Responsibilities
      - Model ->  Database schema; Database operations
      - View -> UI (React, HTML, etc.)
      - Controller -> Receives request; Validates request; Calls Model; Sends response.
    - Problem with MVC
      - Business logic starts living inside controllers.
      - Controllers become difficult to maintain.
    
  - MCS (Model - Controller - Service)
    - Responsibilities
      - Model -> Schema ; Database collections
      - Controller -> Only HTTP-related work. Read req, Call Service, Return res. No business logic.
      - Service-> Contains all business logic.
    
- ##### Why did we choose MCS?
  - I used the MCS architecture because it separates business logic from HTTP handling. Controllers remain small and are responsible only for processing requests and sending responses, while Services contain all the business logic. This improves readability, makes testing easier, and allows the same business logic to be reused from multiple controllers or background jobs.

- ##### Why do we use next(error) instead of return res.status(500)...?
  - We use `next(error)` to delegate error handling to Express's centralized error middleware. This removes duplicate `try/catch` response logic from every controller, keeps controllers focused on request handling, and ensures all errors are returned in a consistent format. If we later want to add logging, monitoring, or custom error responses, we only need to change one place.
  - Express doesn't care about the variable name. It only cares that the middleware function has four parameters.

- ##### What is the difference between next() and next(error)?
  - `next()` tells Express to continue executing the next normal middleware or route handler. `next(error)` tells Express that an error has occurred, so it skips all remaining normal middleware and transfers control directly to the global error-handling middleware.

- ##### Why is the global error middleware registered after all routes? Or its is use at the end of all the routes in app?
  - Express executes middleware in the order it is registered. When `next(error)` is called, Express looks forward for the next error-handling middleware. If the error middleware is placed before the routes, Express has already passed it and won't go back. Therefore, it must be registered after all routes so it can catch errors from any controller or middleware.

- ##### Why next() is not used in the try block of controller?
  - Middleware usually calls `next()` because it doesn't finish the request. Controllers usually don't call `next()` because they send the final response. The exception is when a controller catches an unexpected error—it should call `next(error)` to hand it off to the global error handler.

- ##### What is asyncHandler and why do we use it?
  - asyncHandler is a higher-order function that accepts an async controller and returns a wrapper middleware. The wrapper executes the controller inside a try/catch and forwards any rejected promise or thrown error to Express using next(error). This removes repetitive try/catch blocks from individual controllers and allows centralized error handling.

- ##### Why would you use select: false on the password field if you need the password during login?
  - `select: false` prevents the password hash from being included in normal Mongoose queries by default. During login, we explicitly include it using `.select('+password')` because bcrypt needs the stored hash to verify the supplied password. This creates a secure-by-default approach and reduces the chance of accidentally exposing password hashes.

- ##### Why did you create separate createCustomer and createAgent controllers when both ultimately create a user?
  - Although both operations create a user, they represent different API operations with different authorization rules. Customer registration is public, whereas agent creation is restricted to administrators. I separated the controllers so each operation has a clear responsibility and security boundary, while keeping the common user-creation logic in a shared service to avoid duplicating business logic.

- ##### Why is createdBy determined by req.user.id instead of accepting it from the client?
  - 

- ##### JWT authentication is stateless; if immediate revocation is required, additional mechanisms are needed.
  - 

- ##### Decode MongoDB Atlas DB url to connect with frontend.
  - URL
    - `mongodb+srv://USERNAME:PASSWORD@CLUSTER/DATABASE?OPTIONS`
    - `mongodb+srv://USERNAME:PASSWORD@customer-support-ticket.psiq2sv.mongodb.net/customer_support?appName=customer-support-ticket`
      - `mongodb+srv://` Use MongoDB's SRV conneciton protocol.
      - `USERNAME:PASSWORD` User's username and password of atlas.
      - `@customer-support-ticket.psiq2sv.mongodb.net` This is the MongoDB Atlas cluster address.
      - `customer_support` Connect to this MongoDB cluster and use customer_support as the default database for this connection.
      - If no database name is provided manually, then default vaule is .net/, and it will be connected to **test** database of MongoDB Atlas.

- ##### 
  - 
