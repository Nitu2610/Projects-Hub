import { Request, Response, NextFunction } from "express";
import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.types";

const optionalAuthenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies?.accessToken;

    // Guest user — continue without authentication
    if (!token) {
      return next();
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY is missing.");
    }

    const decodedToken = jwt.verify(
      token,
      jwtSecretKey
    ) as AuthPayload;

    req.user = decodedToken;

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next();
    }

    if (err instanceof JsonWebTokenError) {
      return next();
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = optionalAuthenticationMiddleware;