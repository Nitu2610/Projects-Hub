# Why It Exist:->

- ##### Why keep app.js and server.js separate?
  - Answer:
    - app.js configures the application (middlewares, routes).
    - server.js starts the server.
    - This separation makes testing and maintenance easier.

- ##### what is process?
  - Node creates a global object called process when your application starts. It contains information about the current Node.js process. 
  - Some commonly used properties are: 
    - ` process.env      // Environment variables  `
    - ` process.argv     // Command-line arguments `
    - ` process.cwd()    // Current working directory `
    - ` process.exit()   // Stop the application `
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

- #####  .env file rule
  - `PORT=5000` PORT field name, = assigned, 5000 is value.
  - No Semicolon, No space after `=`. 