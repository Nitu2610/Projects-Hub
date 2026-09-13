import { Request, Response, NextFunction } from "express";

const authorize = (role: string[] | string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const allowedRole = Array.isArray(role) ? role : [role];
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};

module.exports = authorize;
