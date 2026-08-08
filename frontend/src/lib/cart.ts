import { parsePrice } from "./format";
import type { CartItem } from "../types/cart";

export const TAX_RATE = 0.08;
export const SHIPPING_FEE = 15;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const calculateOrderTotals = (
  cart: CartItem[],
  options: { shipping?: number; taxRate?: number } = {},
): OrderTotals => {
  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? (options.shipping ?? SHIPPING_FEE) : 0;
  const tax = cart.length > 0 ? subtotal * (options.taxRate ?? TAX_RATE) : 0;

  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};