const express = require("express");
const { getOrderByIdValidation, updateOrderStatusValidation, cancelOrderValidation
 } = require("../validators/admin.order.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");
const adminOrderController = require("../controllers/admin.order.controller");

const adminOrderRoute = express.Router();

adminOrderRoute.get(
  "/",
  authMiddleware,
  authorize("admin"),
  asyncHandler(adminOrderController.getOrders)
);

adminOrderRoute.get(
  "/:orderId",
  authMiddleware,
  authorize("admin"),
  getOrderByIdValidation,
  validatorMiddleware,
  asyncHandler(adminOrderController.getOrderById)
);


adminOrderRoute.patch(
  "/:orderId/status",
  authMiddleware,
  authorize("admin"),
  updateOrderStatusValidation,
  validatorMiddleware,
  asyncHandler(adminOrderController.updateOrderStatus)
);

adminOrderRoute.patch(
  "/:orderId/cancel",
  authMiddleware,
  authorize("admin"),
  cancelOrderValidation,
  validatorMiddleware,
  asyncHandler(adminOrderController.cancelOrder)
);

module.exports = adminOrderRoute;