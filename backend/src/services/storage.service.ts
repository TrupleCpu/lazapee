import "multer";
import { storage, BUCKET_ID, ID } from "../config/appwrite.js";

/**
 * Uploads an image to Appwrite Storage and returns its public URL.
 */
export async function uploadImage(file: Express.Multer.File): Promise<string> {
  try {
    const fileUint8 = new Uint8Array(file.buffer);
    const webFile = new File([fileUint8], file.originalname, {
      type: file.mimetype,
    });
    const response = await storage.createFile({
      bucketId: BUCKET_ID as string,
      fileId: ID.unique(),
      file: webFile,
    });

    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const fileUrl = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=${projectId}`;
    return fileUrl.toString();
  } catch (error) {
    console.error("Failed to upload image: ", error);
    throw error;
  }
}

/**
 * Deletes an image from Appwrite Storage using its public URL.
 */
export async function uploadMultipleImage(
  files: Express.Multer.File[],
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file));

  return Promise.all(uploadPromises);
}

export async function deleteImageByUrl(fileUrl: string): Promise<void> {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const fileId = pathParts[pathParts.indexOf("files") + 1];

    if (fileId) {
      await storage.deleteFile({
        bucketId: BUCKET_ID as string,
        fileId: fileId,
      });
    }
  } catch (error) {
    console.error("Appwrite Deletion Error:", error);
  }
}
