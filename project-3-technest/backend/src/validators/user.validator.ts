import { Meta } from "express-validator";

const { body } = require("express-validator");

const userRegisterValidator = [
  body("fullName").trim().notEmpty().withMessage("Please enter the full name."),
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters."),
  body("mobile")
    .trim()
    .isNumeric()
    .withMessage("Please enter a valid mobile number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Please enter a valid mobile number"),
];

const userLoginValidator = [
  body("email").trim().isEmail().withMessage("Enter a valid email address."),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 - 20 character."),
];

const updateUserProfileValidator = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full name must be between 3 and 100 characters."),

  body("mobile")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid Indian mobile number."),
];

const changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password.")
    .custom((value: string, { req }: Meta) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }

      return true;
    }),
];

module.exports = {
  userRegisterValidator,
  userLoginValidator,
  updateUserProfileValidator,
  changeUserPasswordValidator,
};
