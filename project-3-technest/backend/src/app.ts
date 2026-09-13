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


app.use("/category", categoryRoute);


app.use(errorHandler);

module.exports = app;
