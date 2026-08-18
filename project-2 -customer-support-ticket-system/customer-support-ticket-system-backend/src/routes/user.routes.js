const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");
const {
  validateRegister,
  validateLogin,
} = require("../validators/user.validator");
const validationMiddleware = require("../middleware/validation.middleware");
const asyncHandler = require("../utils/asyncHandler");

const userRouter = express.Router();

// Public user endpoints.
// These routes do not require authentication.

//Customer registration
// Request -> validation -> controller -> service -> database
userRouter.post(
  "/register",
  validateRegister,
  validationMiddleware,
  asyncHandler(userController.createCustomer),
);

// User login:
// Request -> validation -> controller -> service -> password verification -> JWT
userRouter.post(
  "/login",
  validateLogin,
  validationMiddleware,
  asyncHandler(userController.userLogin),
);

// All routes registered below this middleware require
// a valid authenticated user.
userRouter.use(authMiddleware);

// Only administrators can view the complete user list.
userRouter.get(
  "/",
  authorizeRoles("admin"),
  asyncHandler(userController.getAllUsers),
);

// Only administrator can create agent accounts.
userRouter.post(
  "/register/agents",
  authorizeRoles("admin"),
  validateRegister,
  validationMiddleware,
  asyncHandler(userController.createAgent),
);

module.exports = userRouter;
