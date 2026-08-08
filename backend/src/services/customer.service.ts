import { supabase } from "../config/supabase.js";
import type { CustomerSummary } from "../types/customer.js";
import type { Order } from "../types/orders.js";

/**
 * Retrieves customer summaries by grouping orders by email
 * and calculating each customer's total purchases and order count.
 */
export async function getCustomers() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) throw error;

  const orders = data as Order[];

  const customerMap = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const key = order.customer_email.trim().toLowerCase();
    const total = Number(order.total);

    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalPurchase += total;

      existing.name = order.customer_name;
      existing.contactNumber = order.customer_phone;
    } else {
      customerMap.set(key, {
        id: order.customer_id,
        name: order.customer_name,
        email: order.customer_email,
        contactNumber: order.customer_phone,
        orderCount: 1,
        totalPurchase: total,
        status: "Active",
      });
    }
  }

  return [...customerMap.values()];
}
