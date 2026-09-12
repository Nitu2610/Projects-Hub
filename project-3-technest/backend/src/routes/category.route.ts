const express = require("express");
const { categoryValidator } = require("../validators/category.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");
const categoryController = require("../controllers/category.controller");

const categoryRoute = express.Router();

categoryRoute.post(
  "/add-category",
  // authMiddleware,
 // authorize("admin"), // Need to create the unlock after frontend integration.
  categoryValidator,
  validatorMiddleware,
  asyncHandler(categoryController.addCategory),
);

module.exports = categoryRoute;
