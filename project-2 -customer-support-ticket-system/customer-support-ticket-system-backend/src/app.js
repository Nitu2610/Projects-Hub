const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const ticketRoutes = require("./routes/ticket.routes");

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.use("/", healthRoutes);

app.use("/tickets", ticketRoutes);

module.exports = app;
