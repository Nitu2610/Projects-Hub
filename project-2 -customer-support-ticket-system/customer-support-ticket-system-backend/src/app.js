const express= require('express');
const cors=require('cors');
const morgan=require('morgan');

const healthRoutes= require("./routes/ticket.routes")

const app= express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));


app.use("/", healthRoutes)

module.exports= app;

