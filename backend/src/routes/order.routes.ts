/**
 * Defines routes for retrieving and managing orders.
 */
import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderDetailsById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/", createOrder);

// Protected admin routes
router.get("/getOrders", authenticate, getOrders);
router.get("/:id", authenticate, getOrderDetailsById);
router.patch("/:id", authenticate, updateOrderStatus);
router.delete("/:id", authenticate, deleteOrder);

export default router;
