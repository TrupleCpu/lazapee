/**
 * Handles authentication-related HTTP requests.
 */

import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

/**
 * Authenticate a user and stores the JWT in an HTTP-only cookie.
 */
export async function login(req: Request, res: Response) {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
}

/**
 * Returns currently authenticated user.
 */
export async function me(req: Request, res: Response) {
  res.json(req.user);
}

/**
 * Logs out the current user by clearing the authentication cookie.
 */
export async function logout(req: Request, res: Response) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logout Successfully",
  });
}
