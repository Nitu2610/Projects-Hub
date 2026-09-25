const { body, param } = require("express-validator");

const AddressLabels = {
  Home: "Home",
  Work: "Work",
  Other: "Other",
};

const addressIdValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("Invalid address ID."),
];

const addressValidator = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Address label can't be empty.")
    .isString()
    .withMessage("Invalid label provided.")
    .isIn(Object.values(AddressLabels))
    .withMessage(
      "Invalid label, select Home/Work/Other label."
    ),

  body("fullName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name can't be empty.")
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Full name must be between 3 to 20 characters."
    ),

  body("phone")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Phone number can't be empty.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid Indian mobile number."
    ),

  body("addressLine1")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Address can't be empty.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Invalid address details."),

  body("addressLine2")
    .optional({ values: "null" })
    .isString()
    .withMessage("Invalid address details.")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Address line 2 is too long."),

  body("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City can't be empty.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Invalid city name."),

  body("state")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("State can't be empty.")
    .isLength({ min: 3, max: 15 })
    .withMessage("Invalid state name."),

  body("postalCode")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Pincode can't be empty.")
    .matches(/^[1-9]\d{5}$/)
    .withMessage("Invalid pincode."),
];

const updateAddressValidator = [
  ...addressIdValidator,

  body("label")
    .optional()
    .isString()
    .trim()
    .isIn(Object.values(AddressLabels))
    .withMessage(
      "Invalid label, select Home/Work/Other label."
    ),

  body("fullName")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name can't be empty.")
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Full name must be between 3 to 20 characters."
    ),

  body("phone")
    .optional()
    .isString()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid Indian mobile number."
    ),

  body("addressLine1")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Address can't be empty.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Invalid address details."),

  body("addressLine2")
    .optional({ values: "null" })
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Address line 2 is too long."),

  body("city")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City can't be empty.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Invalid city name."),

  body("state")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("State can't be empty.")
    .isLength({ min: 3, max: 15 })
    .withMessage("Invalid state name."),

  body("postalCode")
    .optional()
    .isString()
    .trim()
    .matches(/^[1-9]\d{5}$/)
    .withMessage("Invalid pincode."),
];

module.exports = {
  addressValidator,
  updateAddressValidator,
  addressIdValidator,
};