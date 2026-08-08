/**
 * Configures and exports the multer middleware for handling file uploads.
 * Files are stored in memory with a maximum size of 4 MB.
 */

import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
