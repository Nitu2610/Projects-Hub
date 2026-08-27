// Load environment variables before initializing the application.
// This makes values such as PORT and database credential available
// through process.env
require("dotenv").config();
const User = require("./models/user.model");

const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 7000;

// Application startup flow:
// 1. Connect to MongoDB
// 2. Start the Express HTTP server
//
// The server is started only after the database connection succeeds,
// preventing the API from accepting requests when the database is unavailable.

const startServer = async () => {
  await connectDB();

  // Its helps to know, current Database.
  console.log("Database: ", User.db.name);
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
