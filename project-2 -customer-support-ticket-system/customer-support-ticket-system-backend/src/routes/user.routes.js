const express= require("express");
const userController= require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");
const { validateRegister, validateLogin } =require("../validators/user.validator");
const validationMiddleware=require("../middleware/validation.middleware");
const asyncHandler = require("../utils/asyncHandler");

const userRouter=express.Router();

userRouter.post("/register", validateRegister , validationMiddleware , asyncHandler(userController.createUser));

userRouter.post("/login", validateLogin, asyncHandler(validationMiddleware, userController.userLogin) );


// everything below require authentication 

userRouter.use(authMiddleware)

userRouter.get("/", 
authorizeRoles("admin"),
  asyncHandler(userController.getAllUsers)) ;

  
module.exports=userRouter;