const{body}=require("express-validator");


const registerCustomerValidator=[
  body("fullName")
  .trim()
  .notEmpty()
  .withMessage("Please enter the full name.")
  ,
  body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Please enter a valid email address")
  ,
  body("password")
  .isLength({min:8, max:20})
  .withMessage("Password must be between 8 and 20 characters.")
  ,
  body("mobile")
  .trim()
  .isNumeric()
  .withMessage("Please enter a valid mobile number")
  .isLength({min:10, max:10})
  .withMessage("Please enter a valid mobile number")

]


module.exports={
  registerCustomerValidator
}