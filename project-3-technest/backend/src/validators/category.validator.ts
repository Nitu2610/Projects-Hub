const { body, param } = require("express-validator");

const categoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Enter a valid name.")
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("The length must be 3 to 20 characters."),
  body("parent")
  .optional({ values: "null" })
    .isMongoId()
    .withMessage("The parent id is incorrect."),
];
const updateCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Enter a valid name.")
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("The length must be 3 to 20 characters."),
  param("id").isMongoId().withMessage("Invalid Id."),
];

const updateCategoryStatusValidator = [
  param("id").isMongoId().withMessage("Invalid category Id."),
  body("active")
    .isBoolean({ strict: true })
    .withMessage("Update the status of category with valid value."),
];

module.exports = {
  categoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
};
