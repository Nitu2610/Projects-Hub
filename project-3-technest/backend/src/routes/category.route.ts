const express = require("express");

const {
  categoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
} = require("../validators/category.validator");

const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");

const categoryController = require("../controllers/category.controller");

const categoryRoute = express.Router(); 



categoryRoute.post(
  "/add-category",
  authMiddleware,
  authorize("admin"),
  categoryValidator,
  validatorMiddleware,
  asyncHandler(categoryController.addCategory)
);

categoryRoute.get(
  "/",
  authMiddleware,
  authorize(["customer", "admin"]),
  asyncHandler(categoryController.getCategories)
);

categoryRoute.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  updateCategoryValidator,
  validatorMiddleware,
  asyncHandler(categoryController.updateCategory)
);

categoryRoute.patch(
  "/:id/status",
  authMiddleware,
  authorize("admin"),
  updateCategoryStatusValidator,
  validatorMiddleware,
  asyncHandler(categoryController.updateCategoryStatus)
);

module.exports = categoryRoute;