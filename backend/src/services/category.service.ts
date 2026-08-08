import { supabase } from "../config/supabase.js";
import type { CreateCategoryPayload } from "../types/products.js";
import { deleteImageByUrl, uploadImage } from "./storage.service.js";

/**
 * Retrieves all product categories along with their product counts.
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, products(count)");

  if (error) {
    throw error;
  }

  return data.map((category) => ({
    ...category,
    productsCount: category.products?.[0]?.count ?? 0,
  }));
}

/**
 * Creates a new product category and uploads its image if provided.
 */
export async function createCategory(payload: CreateCategoryPayload) {
  let imageUrl: string | null = null;

  if (payload.imageFile) {
    imageUrl = await uploadImage(payload.imageFile);
  }

  const formattedStatus =
    payload.status.charAt(0).toUpperCase() +
    payload.status.slice(1).toLocaleLowerCase();

  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        title: payload.title,
        slug: payload.slug,
        description: payload.description || null,
        image: imageUrl,
        status: formattedStatus,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates an existing product category and replaces its image if a new one is provided.
 */
export async function updateCategory(
  categoryId: string,
  payload: Partial<CreateCategoryPayload>,
) {
  const updateData: Record<string, any> = {};

  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.slug !== undefined) updateData.slug = payload.slug;
  if (payload.description !== undefined)
    updateData.description = payload.description;

  if (payload.status) {
    updateData.status =
      payload.status.charAt(0).toUpperCase() +
      payload.status.slice(1).toLowerCase();
  }

  if (payload.imageFile) {
    updateData.image = await uploadImage(payload.imageFile);
  }

  const { data, error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Deletes a product category and removes its associated image from Appwrite Storage.
 */
export async function deleteCategory(categoryId: string) {
  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("image")
    .eq("id", categoryId)
    .single();

  if (fetchError) throw fetchError;

  if (category?.image) {
    await deleteImageByUrl(category.image);
  }
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;

  return true;
}
