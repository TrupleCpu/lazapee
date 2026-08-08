export interface GrowthMetrics {
  products: number;
  orders: number;
  customers: number;
  sales: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  completionRate: number;
  totalCustomers: number;
  totalSales: number;
  growth: GrowthMetrics;
}

export interface SalesPoint {
  label: string;
  sales: number;
}

export type SalesPeriod = "weekly" | "monthly";

export interface RecentOrder {
  id: string;
  order_number: string;  
  customer_name: string;
  customer_email: string;
  created_at: string;
  items: number;
  total: number;
  status: string;
}

export interface InventoryProduct {
  id: string;
  title: string;
  quantity: number;
}

export interface InventoryAlert {
  count: number;
  products: InventoryProduct[];
}