export interface Product {
  id: string | number;
  title: string;
  slug?: string;
  price: string | number;
  quantity: number | null;
  description?: string | null;
  badge?: string | null;
  subtitle?: string | null;
  image?: string | null;
  images?: string[] | null;
  category?: string | null;
  categories?: { id?: string | number; title: string; slug?: string } | null;
  in_stock?: boolean;
  stock_status?: string | null;
  stock_type?: string | null;
  created_at?: string;
}

export interface Category {
  id: string | number;
  title: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  status?: string | null;
  productsCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id?: string | number;
  product_id: string | number;
  product_name: string;
  sku?: string;
  image?: string | null;
  price: string | number;
  quantity: number;
}

export interface Order {
  id: string | number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  delivery_address?: string | null;
  payment_type?: string | null;
  subtotal?: string | number;
  shipping?: string | number;
  tax?: string | number;
  total: string | number;
  status: string;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface Customer {
  id: string | number;
  name: string;
  email: string;
  contactNumber?: string;
  orderCount?: number;
  totalPurchase?: string | number;
  status?: string;
}

export interface RecentOrder {
  id: string | number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  items: number;
  total: string | number;
  status: string;
}

export interface InventoryProduct {
  id: string | number;
  title: string;
  quantity: number;
}

export interface InventoryAlert {
  count: number;
  products: InventoryProduct[];
}

export interface SalesPoint {
  label: string;
  sales: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  completionRate: number;
  totalCustomers: number;
  totalSales: number;
  growth: {
    products: number;
    orders: number;
    customers: number;
    sales: number;
  };
}

export type PaymentMethod = "cod" | "ewallet" | "bank";