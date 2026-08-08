/**
 * Handles customer-related HTTP requests
 */
import type { Request, Response } from "express";
import * as customerService from "../services/customer.service.js";

/**
 * Returns a list of all customers
 */
export async function getCustomers(req: Request, res: Response) {
  try {
    const customers = await customerService.getCustomers();

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
}
