import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getCustomers);

export default router;
