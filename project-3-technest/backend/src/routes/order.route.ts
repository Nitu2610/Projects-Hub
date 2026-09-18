const express = require("express");
const { createOrderValidation,cancelOrderValidation
 } = require("../validators/order.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");
const orderController = require("../controllers/order.controller");

const orderRoute = express.Router();

orderRoute.post(
  "/create-order",
  authMiddleware,
  authorize("customer"),
  createOrderValidation,
  validatorMiddleware,
  asyncHandler(orderController.createOrder),
);


orderRoute.get(
  "/",
  authMiddleware,
  authorize("customer"),
  asyncHandler(orderController.getOrders)
);

orderRoute.get(
  "/:orderId",
  authMiddleware,
  authorize("customer"),
  asyncHandler(orderController.getOrderById)
);

orderRoute.patch(
  "/:orderId/cancel",
  authMiddleware,
  authorize("customer"),
  cancelOrderValidation,
  validatorMiddleware,
  asyncHandler(orderController.cancelOrder)
);


module.exports = orderRoute;


