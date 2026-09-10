import type { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  userId: string;
  role: string;
}
