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