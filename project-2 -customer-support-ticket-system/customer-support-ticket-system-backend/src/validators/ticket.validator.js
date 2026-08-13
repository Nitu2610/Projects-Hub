const {body}= require("express-validator");


const validateTicket=[
  body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required.")
  .isLength({min: 20, max: 50})
  .withMessage("Title length must be within 20-50 letters.")
  ,
  body("description")
  .trim()
  .notEmpty()
  .withMessage("Description is required.")
  .isLength({min: 50, max: 200})
  .withMessage("Description must be within 50-200 letters.")
  ,
  body("issueOccuredAt")
  .isDate()
  .withMessage("Issue occured date is incorrect.")
  ,
]


module.exports={validateTicket,}
