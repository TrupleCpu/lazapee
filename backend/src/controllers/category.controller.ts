/**
 * Hamdles category-related HTTP requests.
 */
import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.js";
import type { CreateCategoryPayload } from "../types/products.js";

/**
 * Returns a list of all categories.
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
}

/**
 * Creates a new category from the request data.
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { title, slug, description, status } = req.body;

    const imageFile = req.file;

    const cateagory = await categoryService.createCategory({
      title,
      slug,
      description,
      status,
      imageFile,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: cateagory,
    });
  } catch (error) {
    console.error("Error creating category: ", error);
    res.status(500).json({ message: "Failed to create category" });
  }
}

/**
 * Updates a category by its ID using the request data.
 */
export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, slug, description, status } = req.body;
    const imageFile = req.file;

    const updatePayload: Partial<CreateCategoryPayload> = {};

    if (title !== undefined) updatePayload.title = title;
    if (slug !== undefined) updatePayload.slug = slug;
    if (description !== undefined) updatePayload.description = description;
    if (status !== undefined) updatePayload.status = status;
    if (imageFile) updatePayload.imageFile = imageFile;

    const updateCategory = await categoryService.updateCategory(
      id as string,
      updatePayload,
    );

    res.status(200).json({
      message: "Category updated successfully",
      data: updateCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
}

/**
 * Deletes a category by its ID.
 */
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await categoryService.deleteCategory(id as string);

    res.status(200).json({
      message: "Category deleted succesfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
}
