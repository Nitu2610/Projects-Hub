const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const ticketRoutes = require("./routes/ticket.routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Parse incoming JSON request bodies so controllers can access
// request data through req.body.
app.use(express.json());

// Global middleware.
// CORS allows requests from the frontend, while Morgan logs
// incoming HTTP requests during development;
app.use(cors());
app.use(morgan("dev"));

// API route groups.
// Each route module is responsoble for handling requests within
// its respective feature/domain.
app.use("/", healthRoutes);
app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);

// Error-handling middleware must be registered after the routes
// so errors propageted from the request pipeline can be handled centrally.
app.use(errorHandler);

module.exports = app;
