const express= require("express");
const userController= require("../controllers/user.controller")

const userRouter=express.Router();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/register", userController.createUser)






module.exports=userRouter;