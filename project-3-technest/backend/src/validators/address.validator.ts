const { body } = require("express-validator");

const Labels = {
  Home: "Home",
  Work: "Work",
  Other: "Other",
};
const addressValidator = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Address label can't be empty.")
    .isString()
    .withMessage("Invalid label provided")
    .isIn(Object.values(Labels))
    .withMessage("Invalid lable, select Home/Work/Other label"),
  body("fullName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name can't be empty.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Full name must be between 3 to 20 characters."),
  body("phone")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Phone number can't be empty.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid Indian mobile number"),
  body("addressLine1")
    .isString()
    .trim()
    .notEmpty()
    .withMessage(" Address can't be empty.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Invalid address details."),
  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Invalid address details.")
    .trim()
    .isLength({ max: 50 }),
  body("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage(" City can't be empty.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Invalid city name."),
  body("state")
    .isString()
    .trim()
    .notEmpty()
    .withMessage(" State can't be empty.")
    .isLength({ min: 3, max: 15 })
    .withMessage("Invalid State name."),
  body("postalCode")
    .isString()
    .trim()
    .notEmpty()
    .withMessage(" Pincode can't be empty.")
    .matches(/^[1-9]\d{5}$/)
    .withMessage("Invalid  pincode."),
];

module.exports = { addressValidator };
