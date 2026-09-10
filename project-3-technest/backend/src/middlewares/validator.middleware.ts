import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation Errors",
        data: errors.array(),
      });
  }
  next();
};

module.exports = validatorMiddleware;
