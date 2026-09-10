import { Request, Response, NextFunction } from "express";
const logError = require("../utils/logError");

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logError(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
