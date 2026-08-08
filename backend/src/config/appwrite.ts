/**
 * Appwrite Configuration.
 * 
 * Creates and exports the configured Appwrite storage client
 * along with the commonly used utitilies for file uploads.
 */
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);

export const storage = new Storage(client);
export const BUCKET_ID = process.env.APPWRITE_BUCKET_ID;
export { ID, InputFile };
