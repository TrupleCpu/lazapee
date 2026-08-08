/**
 * Handles product-related HTTP requests.
 */
import type { Request, Response } from "express";
import * as productService from "../services/products.service.js";
import type {
  CreateCategoryPayload,
  CreateProductPayload,
} from "../types/products.js";

/**
 * Returns a list of all products.
 */
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await productService.getProducts();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

/**
 * Returns the details of a product by its ID.
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id as string);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}

/**
 * Creates a new product from the request data.
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const {
      title,
      slug,
      subtitle,
      badge,
      category_id,
      price,
      quantity,
      description,
      stock_type,
      in_stock,
      stock_status,
    } = req.body;

    let imageFiles: Express.Multer.File[] | undefined = undefined;

    if (Array.isArray(req.files)) {
      imageFiles = req.files;
    } else if (req.files && typeof req.files === "object") {
      imageFiles = Object.values(req.files).flat();
    }

    const product = await productService.createProduct({
      title,
      slug,
      subtitle,
      badge,
      category_id,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      description,
      stock_type,
      in_stock: in_stock === "true" || in_stock === true,
      stock_status,
      imageFiles,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    const detail =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, Object.getOwnPropertyNames(error));
    res.status(500).json({
      message: "Failed to create product",
      error: detail,
    });
  }
}

/**
 * Updates a product by its ID using the request data.
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      subtitle,
      badge,
      category_id,
      price,
      quantity,
      description,
      stock_type,
      in_stock,
      stock_status,
      existingImages,
    } = req.body;

    let imageFiles: Express.Multer.File[] | undefined = undefined;
    if (Array.isArray(req.files)) {
      imageFiles = req.files;
    } else if (req.files && typeof req.files === "object") {
      imageFiles = Object.values(req.files).flat();
    }

    let parsedExistingImages: string[] | undefined = undefined;
    if (existingImages) {
      parsedExistingImages =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
    }

    const updatePayload: Partial<CreateProductPayload> & {
      existingImages?: string[];
    } = {};

    if (title !== undefined) updatePayload.title = title;
    if (slug !== undefined) updatePayload.slug = slug;
    if (subtitle !== undefined) updatePayload.subtitle = subtitle;
    if (badge !== undefined) updatePayload.badge = badge;
    if (category_id !== undefined) updatePayload.category_id = category_id;
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (quantity !== undefined) updatePayload.quantity = parseInt(quantity, 10);
    if (description !== undefined) updatePayload.description = description;
    if (stock_type !== undefined) updatePayload.stock_type = stock_type;
    if (in_stock !== undefined) {
      updatePayload.in_stock = in_stock === "true" || in_stock === true;
    }
    if (stock_status !== undefined) updatePayload.stock_status = stock_status;
    if (imageFiles && imageFiles.length > 0)
      updatePayload.imageFiles = imageFiles;
    if (parsedExistingImages)
      updatePayload.existingImages = parsedExistingImages;

    const updatedProduct = await productService.updateProduct(
      id as string,
      updatePayload,
    );
    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Deletes a product by its ID.
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id as string);

    res.status(200).json({
      message: "Product deleted succesfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
