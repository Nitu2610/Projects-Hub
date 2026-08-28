const{validationResult}=require("express-validator");


const validatorMiddleware=(req,res,next)=>{
  const errors=validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success:false,
      message:"Validation Errors",
      data:errors.array(),
    });
  };

  next();
}

module.exports=validatorMiddleware;