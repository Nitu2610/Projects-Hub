const express= require("express");
const cors=require("cors");
const morgan=require("morgan");
const userRoute = require("./src/routes/user.routes");
const errorHandler=require("./src/middlewares/errorHandler");
const cookieParser=require("cookie-parser");

const app=express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.use(cookieParser());



app.use('/users', userRoute)


app.use(errorHandler);

module.exports=app;