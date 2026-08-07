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


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzM3M2QzMTg2OTc5ZTliZWFlNmVmOSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4NjA5ODgzNiwiZXhwIjoxNzg2MTg1MjM2fQ.8fxyAyX4tglwcnX2GJTFf-Y-5LXiIS50tAaxQZu3t-8

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzM3M2QzMTg2OTc5ZTliZWFlNmVmOSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4NjA5ODkxOSwiZXhwIjoxNzg2MTg1MzE5fQ.DWJoxwIe8M8KQmXQfe37urtFdzbFthWdNjniGxco1N8