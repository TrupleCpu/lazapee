/**
 * Defines routes for retrieving dashboard statistics,
 * sales data, recent orders, and inventory alerts.
 */
import { Router } from "express";
import {
  getStats,
  getSales,
  getRecentOrders,
  getInventoryAlert,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, getStats);
router.get("/sales", authenticate, getSales);
router.get("/recent-orders", authenticate, getRecentOrders);
router.get("/inventory", authenticate, getInventoryAlert);

export default router;
