/**
 * Defines routes for managing product categories,
 * including retrieving, creating, updating, and deleting categories.
 */

import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { upload } from "../middleware/multer.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCategories);

// Protected admin routes.
router.post("/", upload.single("image"), authenticate, createCategory);
router.patch("/:id", upload.single("image"), authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
