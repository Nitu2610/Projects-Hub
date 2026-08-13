const {body} = require("express-validator");

const validateRegister=[
  body("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name is required")
  .isLength({min:3, max:30})
  .withMessage("First name must be between 3 and 30 characters")
  ,
  body("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name is required")
  .isLength({min:2, max:30})
  .withMessage("Last name must be between 3 and 30 characters")
  ,
  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email address")
  .normalizeEmail()
  .isLength({max:100})
  .withMessage("Email must not exceed 100 characters")
  ,
  body("password")
  .notEmpty()
  .withMessage("Password cannot be empty.")
  .isLength({min:8,max:30})
  .withMessage("Password length must be between 8 to 30 characters.")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
  .withMessage("Password must contain, at least one uppercase letter,one lowercase letter, one number, one special character @$!%*?& .")
  ,
]

const validateLogin=[
body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email address")
  .normalizeEmail()
  .isLength({max:100})
  .withMessage("Email must not exceed 100 characters.")
  ,
  body("password")
  .notEmpty()
  .withMessage("Password cannot be empty.")
  .isLength({min:8,max:30})
  .withMessage("Password must be between 8 and 30 characters.")
]

module.exports= {validateRegister, validateLogin };


