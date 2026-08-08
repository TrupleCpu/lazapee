import { supabase } from "../config/supabase.js";
import type { CreateProductPayload } from "../types/products.js";
import { deleteImageByUrl, uploadMultipleImage } from "./storage.service.js";

/**
 * Retrieves all products along with their associated categories.
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, title, slug)");

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Retrieves a product and its associated category by its ID.
 */
export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, title, slug)")
    .eq("id", productId);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Creates a new product and uploads its images if provided.
 */
export async function createProduct(payLoad: CreateProductPayload) {
  let imageUrls: string[] = [];

  if (payLoad.imageFiles && payLoad.imageFiles.length > 0) {
    imageUrls = await uploadMultipleImage(payLoad.imageFiles);
  }

  const { imageFiles, ...productData } = payLoad;

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        ...productData,
        images: imageUrls,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(
  productId: string,
  payLoad: Partial<CreateProductPayload> & {
    existingImages?: string[] | undefined;
  },
) {
  const { imageFiles, existingImages, ...productData } = payLoad;
  const updateData: Record<string, any> = { ...productData };

  if (imageFiles && imageFiles.length > 0) {
    const newImageUrls = await uploadMultipleImage(imageFiles);

    updateData.images = existingImages
      ? [...existingImages, ...newImageUrls]
      : newImageUrls;
  } else if (existingImages !== undefined) {
    updateData.images = existingImages;
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Deletes a product and removes its associated images from Appwrite Storage.
 */
export async function deleteProduct(productId: string) {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (fetchError) throw fetchError;

  if (product?.images?.length) {
    await Promise.all(
      product.images.map((url: string) => deleteImageByUrl(url)),
    );
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;

  return true;
}
