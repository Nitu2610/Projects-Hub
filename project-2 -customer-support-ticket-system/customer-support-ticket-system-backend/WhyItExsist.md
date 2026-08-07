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

