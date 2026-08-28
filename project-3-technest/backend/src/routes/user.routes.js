const express = require("express");
const userController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");
const { registerCustomerValidator } = require("../validators/user.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");

const userRoute = express.Router();

userRoute.post(
  "/register",
  registerCustomerValidator,
  validatorMiddleware,
  asyncHandler(userController.registerCustomer),
);

module.exports = userRoute;
