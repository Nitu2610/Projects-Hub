const { body, param } = require("express-validator");

const OrderStatuses = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const PaymentMethods = {
  COD: "COD",
  UPI: "UPI",
  CARD: "CARD",
};

const CardTypes = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
};

const CancellationReasons = {
  CHANGED_MIND: "CHANGED_MIND",
  ORDERED_BY_MISTAKE: "ORDERED_BY_MISTAKE",
  FOUND_BETTER_PRICE: "FOUND_BETTER_PRICE",
  DELIVERY_DELAY: "DELIVERY_DELAY",
  OTHER: "OTHER",
};

const AdminCancellationReasons = {
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  OPERATIONAL_ISSUE: "OPERATIONAL_ISSUE",
  OTHER: "OTHER",
};

const getOrderByIdValidation = [
  param("orderId").isMongoId().withMessage("Invalid order ID."),
];

const createOrderValidation = [
  body("addressId").isMongoId().withMessage("Invalid address ID."),

  body("paymentMethod")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Payment method can't be empty.")
    .isIn(Object.values(PaymentMethods))
    .withMessage("Invalid payment method, select COD/UPI/Card mode."),

  body("paymentData")
    .optional()
    .isObject()
    .withMessage("Payment data must be an object."),

  body("paymentData.upiId")
    .if(body("paymentMethod").equals(PaymentMethods.UPI))
    .exists()
    .withMessage("UPI ID is required for UPI payment.")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid UPI ID."),

  body("paymentData.cardType")
    .if(body("paymentMethod").equals(PaymentMethods.CARD))
    .exists()
    .withMessage("Card type is required for card payment.")
    .isIn(Object.values(CardTypes))
    .withMessage("Card type must be CREDIT or DEBIT."),
];

const updateOrderStatusValidation = [
  param("orderId").isMongoId().withMessage("Invalid order ID."),

  body("orderStatus")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Order status is required.")
    .isIn(Object.values(OrderStatuses))
    .withMessage("Invalid order status."),
];

const cancelOrderValidation = [
  param("orderId").isMongoId().withMessage("Invalid order ID."),

  body("cancellationReason")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cancellation reason is required.")
    .isIn(Object.values(CancellationReasons))
    .withMessage("Invalid cancellation reason."),
];

const cancelAdminOrderValidation = [
  param("orderId").isMongoId().withMessage("Invalid order ID."),

  body("adminCancellationReasons")
    .isString()
    .withMessage("Cancellation reason must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Cancellation reason is required.")
    .isIn(Object.values(AdminCancellationReasons))
    .withMessage("Invalid admin cancellation reason."),
];

module.exports = {
  getOrderByIdValidation,
  createOrderValidation,
  updateOrderStatusValidation,
  cancelOrderValidation,
  cancelAdminOrderValidation,
};
