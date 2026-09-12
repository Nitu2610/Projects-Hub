const {body}= require("express-validator");

const categoryValidator=[
  body("name")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("Enter a valid name.")
  .isLength({min:3, max:20})
  .withMessage("The length must be 3 to 20 characters.")
]

module.exports={
  categoryValidator,
}