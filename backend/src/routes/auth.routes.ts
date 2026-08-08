/**
 * Defines authentication route for administrator login, 
 * session validation, and logout.
 */
import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/logout", logout);

export default router;
