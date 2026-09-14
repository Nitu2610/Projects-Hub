import { body } from "express-validator";

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

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string."),

  body("color")
    .optional()
    .isString()
    .withMessage("Color must be a valid string."),

  body("price")
    .notEmpty()
    .isNumeric()
    .withMessage("Enter a valid price."),

  body("discountedPrice")
    .optional()
    .isNumeric()
    .withMessage("Enter a valid discounted price."),

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
];

module.exports={createProductValidator}