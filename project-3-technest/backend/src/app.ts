const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.routes");
const categoryRoute = require("./routes/category.route");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/users", userRoute);

console.log("request reached before the endpoint");

app.use("/category", categoryRoute);

console.log("request reached after the endpoint");
app.use(errorHandler);

module.exports = app;
