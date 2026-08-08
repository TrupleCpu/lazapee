import { apiFetch } from "./api";
import type {
  Category,
  Customer,
  DashboardStats,
  InventoryAlert,
  Order,
  OrderItem,
  Product,
  RecentOrder,
  SalesPoint,
} from "../types";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<unknown>("/auth/login", { method: "POST", body: payload }),
  me: () => apiFetch<unknown>("/auth/me"),
  logout: () => apiFetch<unknown>("/auth/logout", { method: "POST" }),
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const productsApi = {
  list: () => apiFetch<Product[]>("/products"),
  get: (id: string | number) => apiFetch<Product[]>(`/products/${id}`),
  create: (payload: FormData) =>
    apiFetch<Product>("/products", { method: "POST", body: payload }),
  update: (id: string | number, payload: FormData) =>
    apiFetch<Product>(`/products/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string | number) =>
    apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categoriesApi = {
  list: () => apiFetch<Category[]>("/categories"),
  create: (payload: FormData) =>
    apiFetch<{ message: string; data: Category }>("/categories", {
      method: "POST",
      body: payload,
    }),
  update: (id: string | number, payload: FormData) =>
    apiFetch<{ message: string; data: Category }>(`/categories/${id}`, {
      method: "PATCH",
      body: payload,
    }),
  remove: (id: string | number) =>
    apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface CreateOrderPayload {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderNotes: string;
  cart: {
    id: string;
    title: string;
    slug?: string;
    images?: string[] | null;
    price: string | number;
    quantity: number;
  }[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiFetch<Order>("/orders", { method: "POST", body: payload }),
  list: () => apiFetch<Order[]>("/orders/getOrders"),
  getDetails: (id: string | number) =>
    apiFetch<Order & { order_items: OrderItem[] }>(`/orders/${id}`),
  updateStatus: (id: string | number, status: string) =>
    apiFetch<{ message: string; data: Order }>(`/orders/${id}`, {
      method: "PATCH",
      body: { status },
    }),
  remove: (id: string | number) =>
    apiFetch<{ message: string }>(`/orders/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const customersApi = {
  list: () => apiFetch<Customer[]>("/customers"),
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const dashboardApi = {
  stats: () => apiFetch<DashboardStats>("/dashboard/stats"),
  recentOrders: () => apiFetch<RecentOrder[]>("/dashboard/recent-orders"),
  inventory: () => apiFetch<InventoryAlert>("/dashboard/inventory"),
  sales: (period: string) =>
    apiFetch<SalesPoint[]>(`/dashboard/sales?period=${period}`),
};