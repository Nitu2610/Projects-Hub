const express = require("express");

const {
  getOrderByIdValidation,
  updateOrderStatusValidation,
  cancelOrderValidation,
} = require("../validators/order.validator");

const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");

const orderController = require("../controllers/order.controller");

const adminOrderRoute = express.Router();

adminOrderRoute.get(
  "/",
  authMiddleware,
  authorize("admin"),
  asyncHandler(orderController.getAllOrders)
);

adminOrderRoute.get(
  "/:orderId",
  authMiddleware,
  authorize("admin"),
  getOrderByIdValidation,
  validatorMiddleware,
  asyncHandler(orderController.getAdminOrderById)
);

adminOrderRoute.patch(
  "/:orderId/status",
  authMiddleware,
  authorize("admin"),
  updateOrderStatusValidation,
  validatorMiddleware,
  asyncHandler(orderController.updateOrderStatus)
);

adminOrderRoute.patch(
  "/:orderId/cancel",
  authMiddleware,
  authorize("admin"),
  cancelOrderValidation,
  validatorMiddleware,
  asyncHandler(orderController.cancelAdminOrder)
);

module.exports = adminOrderRoute;