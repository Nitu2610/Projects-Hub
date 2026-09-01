const express = require("express");
const userController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");
const {
  registerCustomerValidator,
  loginCustomerValidator,
} = require("../validators/user.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");

const userRoute = express.Router();

userRoute.post(
  "/register",
  registerCustomerValidator,
  validatorMiddleware,
  asyncHandler(userController.registerCustomer),
);

userRoute.post(
  "/login",
  loginCustomerValidator,
  validatorMiddleware,
  asyncHandler(userController.loginCustomer),
);

userRoute.get("/me", authMiddleware, asyncHandler(userController.customerProfile) );

userRoute.post("/logout",   asyncHandler(userController.logoutCustomer) );

module.exports = userRoute;
