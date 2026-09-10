import { Request, Response, NextFunction } from "express";
const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (role !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};

module.exports = authorize;
