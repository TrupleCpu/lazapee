/**
 * Local development entry point.
 *
 * Responsibilities:
 * - Bootstraps the Express app defined in app.ts.
 * - Starts the HTTP server only when running standalone (not on Vercel).
 */

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Only listen in standalone local execution
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}