import { supabase } from "../config/supabase.js";
import type { CreateOrderDto } from "../types/orders.js";

/**
 * Creates a new order, stores its items, and updates product inventory.
 */
export async function createOrder(order: CreateOrderDto) {
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const { data: createdOrder, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: order.fullName,
      customer_email: order.email,
      customer_phone: order.phone,
      delivery_address: `${order.address}`,
      payment_type: order.paymentMethod,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      notes: order.orderNotes,
    })
    .select()
    .single();

  if (error) throw error;

  const orderItems = order.cart.map((item) => ({
    order_id: createdOrder.id,
    product_id: item.id,
    product_name: item.title,
    sku: item.slug,
    image: item.images?.[0] ?? null,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) throw orderItemsError;

  for (const item of order.cart) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", item.id)
      .single();

    if (productError) throw productError;
    if (!product) throw new Error("Product not found");

    if (product.quantity < item.quantity) {
      throw new Error(`${item.title} is out of stock`);
    }
    const newQuantity = product.quantity - item.quantity;

    const { error } = await supabase
      .from("products")
      .update({
        quantity: newQuantity,
        in_stock: newQuantity > 0,
        stock_type: newQuantity > 0 ? "inStock" : "outOfStock",
      })
      .eq("id", item.id);

    if (error) throw error;
  }

  return createdOrder;
}

/**
 * Retrieves all orders sorted by their creation date.
 */
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Retrieves an order and its associated items by order number.
 */
export async function getOrderDetails(orderNumber: string) {
  const { data: orderData, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;

  return orderData;
}
/**
 * Updates the status of an existing order.
 */
export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
/**
 * Deletes an order by its ID.
 */
export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw error;

  return true;
}
