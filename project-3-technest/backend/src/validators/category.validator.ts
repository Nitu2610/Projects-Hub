const { body, param } = require("express-validator");

const categoryValidator = [
  body("name")
    .isString()
    .withMessage("Category name must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Enter a valid category name.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Category name must be between 3 and 20 characters."),

  body("parent")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("Invalid parent category ID."),
];

const updateCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("name")
    .isString()
    .withMessage("Category name must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Enter a valid category name.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Category name must be between 3 and 20 characters."),
];

const updateCategoryStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("active")
    .isBoolean({ strict: true })
    .withMessage("Category status must be a boolean."),
];

module.exports = {
  categoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
};