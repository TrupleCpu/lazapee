import { supabase } from "../config/supabase.js";
import type {
  DashboardMetrics,
  InventoryAlert,
  RecentOrder,
  SalesPeriod,
  SalesPoint,
} from "../types/dashboard.js";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Calculates the percentage growth between two values.
 */
function growthPercent(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Retrieves dashboard metrics, including products, orders, customers, sales, and growth statistics.
 */
export async function getStats(): Promise<DashboardMetrics> {
  const now = new Date();
  const periodStart = new Date(now.getTime() - 30 * DAY_MS);
  const prevStart = new Date(now.getTime() - 60 * DAY_MS);

  const nowIso = now.toISOString();
  const periodIso = periodStart.toISOString();
  const prevIso = prevStart.toISOString();

  const [
    productsRes,
    ordersRes,
    pendingRes,
    completedRes,
    salesRes,
    customersRes,
    periodOrdersRes,
    prevOrdersRes,
    periodProductsRes,
    prevProductsRes,
    periodCustomersRes,
    prevCustomersRes,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "Completed"),
    supabase.from("orders").select("total"),
    supabase.from("orders").select("customer_email"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", periodIso)
      .lt("created_at", nowIso),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", prevIso)
      .lt("created_at", periodIso),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .gte("created_at", periodIso)
      .lt("created_at", nowIso),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .gte("created_at", prevIso)
      .lt("created_at", periodIso),
    supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", periodIso)
      .lt("created_at", nowIso),
    supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", prevIso)
      .lt("created_at", periodIso),
  ]);

  for (const res of [
    productsRes,
    ordersRes,
    pendingRes,
    completedRes,
    periodProductsRes,
    prevProductsRes,
  ]) {
    if (res.error) throw res.error;
  }
  for (const res of [
    salesRes,
    customersRes,
    periodOrdersRes,
    prevOrdersRes,
    periodCustomersRes,
    prevCustomersRes,
  ]) {
    if (res.error) throw res.error;
  }

  const totalOrders = ordersRes.count ?? 0;
  const pendingOrders = pendingRes.count ?? 0;
  const completedOrders = completedRes.count ?? 0;

  const totalSales = (salesRes.data ?? []).reduce(
    (sum, row) => sum + (Number(row.total) || 0),
    0,
  );

  const customerEmails = new Set<string>();
  for (const row of customersRes.data ?? []) {
    if (row.customer_email) {
      customerEmails.add(String(row.customer_email).trim().toLowerCase());
    }
  }

  const sumTotals = (rows: any[] | null) =>
    (rows ?? []).reduce<number>(
      (sum, row) => sum + (Number(row.total) || 0),
      0,
    );

  const countEmails = (rows: unknown[] | null) => {
    const set = new Set<string>();
    for (const row of rows ?? []) {
      const email = (row as any).customer_email;
      if (email) set.add(String(email).trim().toLowerCase());
    }
    return set.size;
  };

  const periodSales = sumTotals(periodOrdersRes.data);
  const prevSales = sumTotals(prevOrdersRes.data);
  const periodCustomers = countEmails(periodCustomersRes.data);
  const prevCustomers = countEmails(prevCustomersRes.data);
  const periodOrders = periodOrdersRes.data?.length ?? 0;
  const prevOrders = prevOrdersRes.data?.length ?? 0;
  const periodProducts = periodProductsRes.count ?? 0;
  const prevProducts = prevProductsRes.count ?? 0;

  return {
    totalProducts: productsRes.count ?? 0,
    totalOrders,
    pendingOrders,
    completedOrders,
    completionRate:
      totalOrders > 0
        ? Math.round((completedOrders / totalOrders) * 1000) / 10
        : 0,
    totalCustomers: customerEmails.size,
    totalSales: Math.round(totalSales * 100) / 100,
    growth: {
      products: growthPercent(periodProducts, prevProducts),
      orders: growthPercent(periodOrders, prevOrders),
      customers: growthPercent(periodCustomers, prevCustomers),
      sales: growthPercent(periodSales, prevSales),
    },
  };
}

/**
 * Retrieves sales data grouped by the specified time period.
 */
export async function getSales(period: SalesPeriod): Promise<SalesPoint[]> {
  const now = new Date();

  let start: Date;
  let labels: string[];
  let bucketKey: (date: Date) => number;

  if (period === "weekly") {
    const diffToMonday = (now.getDay() + 6) % 7;
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - diffToMonday,
    );
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    bucketKey = (date) =>
      Math.floor((date.getTime() - start.getTime()) / DAY_MS);
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    labels = Array.from({ length: 12 }, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return MONTH_LABELS[m.getMonth()] as string;
    });
    bucketKey = (date) =>
      (date.getFullYear() - start.getFullYear()) * 12 +
      (date.getMonth() - start.getMonth());
  }

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total")
    .gte("created_at", start.toISOString());

  if (error) throw error;

  const buckets: number[] = new Array(labels.length).fill(0);
  for (const row of data ?? []) {
    const idx = bucketKey(new Date(row.created_at));
    if (idx >= 0 && idx < labels.length) {
      buckets[idx] = (buckets[idx] ?? 0) + (Number(row.total) || 0);
    }
  }

  return labels.map((label, i) => ({
    label,
    sales: Math.round((buckets[i] ?? 0) * 100) / 100,
  }));
}

/**
 * Retrieves the most recent customer orders.
 */
export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_email, created_at, total, status, order_items(id)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((order) => ({
    id: order.id,
    order_number: order.order_number,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    created_at: order.created_at,
    items: order.order_items?.length ?? 0,
    total: Number(order.total) || 0,
    status: order.status || "Pending",
  }));
}

/**
 * Retrives products that are currently marked as low stock.
 */
export async function getInventoryAlert(): Promise<InventoryAlert> {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, quantity")
    .eq("stock_type", "lowStock")
    .limit(100);

  if (error) throw error;

  const products = (data ?? []).map((product) => ({
    id: product.id,
    title: product.title,
    quantity: product.quantity ?? 0,
  }));

  return { count: products.length, products };
}
