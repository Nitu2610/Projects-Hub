import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.types";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY  is missing.");
    }

    const decodedToken = jwt.verify(token, jwtSecretKey) as AuthPayload;

    req.user = decodedToken;

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
    }
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = authMiddleware;
