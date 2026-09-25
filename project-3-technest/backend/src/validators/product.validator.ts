const { body, param } = require("express-validator");

const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required.")
    .isString()
    .withMessage("Enter a valid product title."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required.")
    .isString()
    .withMessage("Enter a valid product description."),

  body("color")
    .optional()
    .isString()
    .withMessage("Color must be a valid string."),

  body("price")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0."),

  body("discountedPrice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Discounted price must be greater than 0."),

  body("stock")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater."),

  body("specification")
    .notEmpty()
    .isObject()
    .withMessage("Specification must be a valid object."),

  body("category")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("images")
    .isArray({ min: 1, max: 3 })
    .withMessage("Product must have between 1 and 3 images."),

  body("images.*.url")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image URL is required."),

  body("images.*.publicId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image public ID is required."),
];

const updateProductValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product title cannot be empty.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters."),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty."),

  body("color")
    .optional()
    .isString()
    .withMessage("Color must be a valid string."),

  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0."),

  body("discountedPrice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Discounted price must be greater than 0."),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative."),

  body("specification")
    .optional()
    .isObject()
    .withMessage("Specification must be a valid object."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("images")
    .optional()
    .isArray({ min: 1, max: 3 })
    .withMessage("Product must have between 1 and 3 images."),

  body("images.*.url")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image URL is required."),

  body("images.*.publicId")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image public ID is required."),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};