/**
 * Authenticates an administrator using their email and password.
 * Returns a signed JWT and the authenticated user's information.
 */
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import type { loginDto, User } from "../types/auth.js";


export async function login({ email, password }: loginDto) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .single();

  const user = data as User | null;

  if (error || !user) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    },
  );

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}


