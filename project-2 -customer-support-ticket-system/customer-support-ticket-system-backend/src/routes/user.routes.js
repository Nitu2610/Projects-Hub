const express= require("express");
const userController= require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");

const userRouter=express.Router();

userRouter.post("/register", userController.createUser);

userRouter.post("/login", userController.userLogin)


// everything below require authentication 

userRouter.use(authMiddleware)

userRouter.get("/", 
authorizeRoles("admin"),
  userController.getAllUsers);

  
module.exports=userRouter;