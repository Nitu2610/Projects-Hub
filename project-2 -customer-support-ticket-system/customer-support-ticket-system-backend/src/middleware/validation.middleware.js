const {validationResult} = require("express-validator");

const validationMiddleware=(req , res , next)=>{
  const errors= validationResult(req);

  if(!errors.isEmpty()){
   const errorsList= errors.array();
   return res.status(400).json({
    status:false,
    message:"Validation failed",
    errors: errorsList
   })
  }

  next();
}

module.exports= validationMiddleware;