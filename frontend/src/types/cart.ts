import type { Product, CartItem } from "./index";

export type { Product, CartItem };

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
  completeCheckOut: () => void;
  totalItems: number;
}