/**
 * Builds and exports the Express application.
 *
 * Responsibilities:
 * - Configures global middleware.
 * - Registers API routes.
 * - Is shared by the local dev server (index.ts) and the Vercel serverless handler.
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import customerRouters from "./routes/customer.routes.js";
import categoriesRouters from "./routes/categories.route.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";

const app = express();

/**
 * Global middleware.
 * These runs before any route handler.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allows cookie to be send from frontend
  }),
);
app.use(express.json());
app.use(cookieParser());

/**
 * Health Check: To Check if the endpoint is working
 */
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript with Express!" });
});

/**
 * API route registration.
 */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRouters);
app.use("/api/categories", categoriesRouters);
app.use("/api/dashboard", authenticate, dashboardRoutes);

/**
 * Centralized error handler.
 * Catches multer (file upload) and any other errors so clients get a
 * useful JSON response instead of an opaque Express/HTML stack trace.
 */
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);

    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    if (
      (err as { code?: string }).code === "LIMIT_FILE_SIZE" ||
      (err as { code?: string }).code === "LIMIT_UNEXPECTED_FILE" ||
      (err as { code?: string }).code === "LIMIT_FILE_COUNT"
    ) {
      return res.status(400).json({ message, error: message });
    }

    res.status(500).json({ message, error: message });
  },
);

export default app;