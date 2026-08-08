/**
 * Defines routes for retrieving and managing products.
 */
import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { upload } from "../middleware/multer.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected admin routes
router.post("/", upload.array("imageFiles", 5), authenticate, createProduct);

router.patch(
  "/:id",
  upload.array("imageFiles", 5),
  authenticate,
  updateProduct,
);

router.delete("/:id", authenticate, deleteProduct);

export default router;
