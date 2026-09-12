import { NextFunction, Request, Response } from "express";


const debugMiddleware=(req:Request, res:Response, next:NextFunction)=>{
  return console.log("Request reached. Here is the incoming data:", req.body)

}

module.exports=debugMiddleware;