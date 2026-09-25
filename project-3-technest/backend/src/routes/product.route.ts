const express = require("express");

const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");

const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");

const validatorMiddleware = require("../middlewares/validator.middleware");
const asyncHandler = require("../utils/asyncHandler");
const productController = require("../controllers/product.controller");

const productRoute = express.Router();

productRoute.post(
  "/add-product",
  authMiddleware,
  authorize("admin"),
  createProductValidator,
  validatorMiddleware,
  asyncHandler(productController.addProduct)
);

productRoute.get(
  "/",
  authMiddleware,
  authorize(["admin", "customer"]),
  asyncHandler(productController.getProducts)
);

productRoute.get(
  "/:productId",
  authMiddleware,
  authorize(["admin", "customer"]),
  asyncHandler(productController.getProductDetails)
);

productRoute.patch(
  "/:productId",
  authMiddleware,
  authorize("admin"),
  updateProductValidator,
  validatorMiddleware,
  asyncHandler(productController.updateProduct)
);

productRoute.patch(
  "/:productId/deactivate",
  authMiddleware,
  authorize("admin"),
  asyncHandler(productController.deactivateProduct)
);

module.exports = productRoute;