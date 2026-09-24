const express = require("express");
const userController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");
const {
  userRegisterValidator,
  userLoginValidator,
  updateUserProfileValidator,
  changeUserPasswordValidator,
} = require("../validators/user.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");

const userRoute = express.Router();
//users
userRoute.post(
  "/register",
  userRegisterValidator,
  validatorMiddleware,
  asyncHandler(userController.userRegister),
);

userRoute.post(
  "/login",
  userLoginValidator,
  validatorMiddleware,
  asyncHandler(userController.userLogin),
);

userRoute.get(
  "/profile",
  authMiddleware,
  authorize(["customer", "admin"]),
  asyncHandler(userController.userProfile),
);

userRoute.patch(
  "/profile",
  authMiddleware,
  authorize(["customer", "admin"]),
  updateUserProfileValidator,
  validatorMiddleware,
  asyncHandler(userController.updateUserProfile),
);

userRoute.patch(
  "/change-password",
  authMiddleware,
  authorize("customer"),
  changeUserPasswordValidator,
  validatorMiddleware,
  asyncHandler(userController.changeUserPassword),
);

userRoute.post("/logout", asyncHandler(userController.logoutCustomer));

userRoute.get(
  "/customers",
  authMiddleware,
  authorize("admin"),
  asyncHandler(userController.getAllCustomers)
);


userRoute.get("/check", asyncHandler(userController.checking));

module.exports = userRoute;
