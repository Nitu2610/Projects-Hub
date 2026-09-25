const { body, param } = require("express-validator");

const OrderStatuses = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const AdminCancellationReasons = {
  CHANGED_MIND: "CHANGED_MIND",
  ORDERED_BY_MISTAKE: "ORDERED_BY_MISTAKE",
  FOUND_BETTER_PRICE: "FOUND_BETTER_PRICE",
  DELIVERY_DELAY: "DELIVERY_DELAY",
  OTHER: "OTHER",
};

const getOrderByIdValidation = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID."),
];

const updateOrderStatusValidation = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("orderStatus")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Order status is required.")
    .isIn(Object.values(OrderStatuses))
    .withMessage("Invalid order status."),
];

const cancelOrderValidation = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("cancellationReason")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cancellation reason is required.")
    .isIn(Object.values(AdminCancellationReasons))
    .withMessage("Invalid cancellation reason."),
];

module.exports = {
  getOrderByIdValidation,
  updateOrderStatusValidation,
  cancelOrderValidation,
};