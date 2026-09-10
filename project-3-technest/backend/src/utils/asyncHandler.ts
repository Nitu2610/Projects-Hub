import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  handler: (req: Request, res: Response) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (err:unknown) {
      next(err);
    }
  };
};

module.exports = asyncHandler;
