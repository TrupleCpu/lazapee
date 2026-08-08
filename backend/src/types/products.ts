/// <reference types="multer" />

export interface CreateProductPayload {
  title: string;
  slug: string;
  subtitle?: string | null | undefined;
  badge?: string | null | undefined;
  category_id: string;
  price: number;
  quantity: number;
  description?: string | null | undefined;
  stock_type: "inStock" | "lowStock" | "outOfStock";
  in_stock: boolean;
  stock_status: string;
  imageFiles?: Express.Multer.File[] | undefined;
}

export interface CreateCategoryPayload {
  title: string;
  slug: string;
  description?: string | null | undefined;
  status: "Active" | "Inactive";
  imageFile?: Express.Multer.File | undefined;
}
