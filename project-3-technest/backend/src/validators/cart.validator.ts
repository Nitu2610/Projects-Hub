const { body, param } = require("express-validator");

const addToCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Invalid quantity."),
];

const updateCartItemValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Invalid quantity."),
];

module.exports = {
  addToCartValidator,
  updateCartItemValidator,
};