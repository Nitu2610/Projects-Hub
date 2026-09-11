const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler");
import { Request, Response, NextFunction } from "express";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("📥 Request received");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("CONTENT-TYPE:", req.headers["content-type"]);

    next();
});

console.log(" 1️⃣ Before JSON parse")
app.use(express.json());

console.log(" 1️2️⃣ After JSON parse")

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/users", userRoute);

app.use(errorHandler);

module.exports = app;