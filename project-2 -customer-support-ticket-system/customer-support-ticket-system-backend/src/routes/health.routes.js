const express=require("express");

const router = express.Router();

router.get("/",(req, res)=>{
  res.status(200).json({
    success : "true",
    message:" Customer Support Ticket API in running."
  })
})

router.get("/health", (req, res) =>{
  res.status(200).json({
    status:true,
    message:" Server is healthy."
  })
})

module.exports= router;