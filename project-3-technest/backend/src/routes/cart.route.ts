const express = require("express");

const {
  addToCartValidator,
  updateCartItemValidator,
} = require("../validators/cart.validator");

const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");

const cartController = require("../controllers/cart.controller");

const cartRoute = express.Router();

cartRoute.post(
  "/items",
  authMiddleware,
  authorize("customer"),
  addToCartValidator,
  validatorMiddleware,
  asyncHandler(cartController.addToCart)
);

cartRoute.get(
  "/",
  authMiddleware,
  authorize("customer"),
  asyncHandler(cartController.getCart)
);

cartRoute.patch(
  "/items/:productId",
  authMiddleware,
  authorize("customer"),
  updateCartItemValidator,
  validatorMiddleware,
  asyncHandler(cartController.updateCartItem)
);

cartRoute.delete(
  "/items/:productId",
  authMiddleware,
  authorize("customer"),
  asyncHandler(cartController.deleteCartItem)
);

cartRoute.delete(
  "/",
  authMiddleware,
  authorize("customer"),
  asyncHandler(cartController.clearCart)
);

module.exports = cartRoute;