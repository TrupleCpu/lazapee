export interface CartItem {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  quantity: number;
}

export interface CreateOrderDto {
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
  cart: CartItem[];
}

export interface Order {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
}

