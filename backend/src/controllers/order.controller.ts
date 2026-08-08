/**
 * Handles order-related HTTP requests.
 */
import type { Request, Response } from "express";
import * as orderService from "../services/orders.service.js";

/**
 * Creates a new order from the request data.
 */
export async function createOrder(req: Request, res: Response) {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
}

/**
 * Returns a list of all orders.
 */
export async function getOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
}

/**
 * Returns the details of an order by its ID.
 */
export async function getOrderDetailsById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const orderDetails = await orderService.getOrderDetails(id as string);

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      message: "Failed to fetch order details",
    });
  }
}

/**
 * Updates the status of the order by its id.
 */
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const orderDetails = await orderService.updateOrderStatus(
      id as string,
      status,
    );

    res.status(200).json({
      message: "Order status updated successfully",
      data: orderDetails,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Failed to update order status",
    });
  }
}

/**
 * Deletes an order by its id
 */
export async function deleteOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await orderService.deleteOrder(id as string);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Order:", error);
    res.status(500).json({ message: "Failed to delete Order" });
  }
}
