import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtUser {
  id: string;
  role: "admin";
}

/**
 * Authenticates incoming requests using the JWT stored in cookies.
 * if the token is valid, the authenticated user is attached to the requests.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}
