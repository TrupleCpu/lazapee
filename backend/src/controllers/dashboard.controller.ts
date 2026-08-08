/**
 * Handles dashboard-related HTTP requests
 */
import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service.js";
import type { SalesPeriod } from "../types/dashboard.js";

/**
 * Returns the dashboard summary statistics.
 */
export async function getStats(req: Request, res: Response) {
  try {
    const stats = await dashboardService.getStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
}

/**
 * Returns sales data for the specific time period.
 */
export async function getSales(req: Request, res: Response) {
  try {
    const period: SalesPeriod =
      req.query.period === "weekly" ? "weekly" : "monthly";
    const sales = await dashboardService.getSales(period);

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching dashboard sales:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard sales",
    });
  }
}

/**
 * Returns the most recent orders
 */
export async function getRecentOrders(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 5;
    const orders = await dashboardService.getRecentOrders(limit);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);

    res.status(500).json({
      message: "Failed to fetch recent orders",
    });
  }
}

/**
 * Returns products the requires inventory attention
 */
export async function getInventoryAlert(req: Request, res: Response) {
  try {
    const inventory = await dashboardService.getInventoryAlert();

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory alert:", error);

    res.status(500).json({
      message: "Failed to fetch inventory alert",
    });
  }
}
