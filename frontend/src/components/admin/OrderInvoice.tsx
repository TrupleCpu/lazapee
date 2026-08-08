import { formatCurrency, formatDate } from "../../lib/format";

export interface InvoiceOrderItem {
  id: string | number;
  name: string;
  image?: string | null;
  sku?: string | null;
  price: number | string;
  quantity: number;
}

export interface InvoiceOrder {
  id: string | number;
  order_number: string;
  status?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  delivery_address?: string | null;
  payment_type?: string | null;
  created_at?: string;
  subtotal: number | string;
  shipping: number | string;
  tax: number | string;
  total: number | string;
  notes?: { notes?: string } | string | null;
  order_items: InvoiceOrderItem[];
}

const paymentLabel = (type?: string | null): string => {
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("wallet") || normalized.includes("ewallet"))
    return "E-Wallet";
  if (normalized.includes("bank")) return "Bank Transfer";
  return "Cash on Delivery";
};

/**
 * Printable invoice document used by both the print stylesheet and the
 * PDF generator. Rendered off-screen (hidden) and shown only in @media print.
 */
const OrderInvoice = ({ order }: { order: InvoiceOrder }) => {
  const items = Array.isArray(order.order_items) ? order.order_items : [];

  return (
    <div className="bg-white text-gray-900 p-10 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-gray-900 pb-6">
        <div>
          <div className="text-3xl font-black tracking-tight text-primary">
            Lazapee
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Full-Stack E-Commerce · Official Invoice
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black uppercase tracking-widest">
            Invoice
          </div>
          <div className="text-sm font-bold text-gray-800 mt-1">
            {order.order_number}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "—"}
          </div>
        </div>
      </div>

      {/* Bill To / Payment */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-200">
        <div>
          <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-2">
            Billed To
          </div>
          <div className="text-sm font-bold text-gray-900">
            {order.customer_name}
          </div>
          <div className="text-xs text-gray-600 mt-1">{order.customer_email}</div>
          {order.customer_phone && (
            <div className="text-xs text-gray-600 mt-0.5">
              {order.customer_phone}
            </div>
          )}
          {order.delivery_address && (
            <div className="text-xs text-gray-600 mt-0.5">
              {order.delivery_address}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-2">
            Payment Method
          </div>
          <div className="text-sm font-bold text-gray-900">
            {paymentLabel(order.payment_type)}
          </div>
          {order.status && (
            <div className="text-xs text-gray-600 mt-1">
              Status: {order.status}
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs mt-6">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="py-2 pr-2 text-[10px] uppercase font-black tracking-wider text-gray-500">
              Product
            </th>
            <th className="py-2 px-2 text-[10px] uppercase font-black tracking-wider text-gray-500">
              SKU
            </th>
            <th className="py-2 px-2 text-right text-[10px] uppercase font-black tracking-wider text-gray-500">
              Price
            </th>
            <th className="py-2 px-2 text-center text-[10px] uppercase font-black tracking-wider text-gray-500">
              Qty
            </th>
            <th className="py-2 pl-2 text-right text-[10px] uppercase font-black tracking-wider text-gray-500">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3 pr-2 font-bold text-gray-900">
                {item.name}
              </td>
              <td className="py-3 px-2 text-gray-500 uppercase">
                {item.sku || "—"}
              </td>
              <td className="py-3 px-2 text-right text-gray-700">
                {formatCurrency(item.price)}
              </td>
              <td className="py-3 px-2 text-center text-gray-700">
                {item.quantity}
              </td>
              <td className="py-3 pl-2 text-right font-black text-gray-900">
                {formatCurrency(Number(item.price || 0) * item.quantity)}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No items.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-bold text-gray-900">
              {Number(order.shipping) > 0
                ? formatCurrency(order.shipping)
                : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(order.tax)}
            </span>
          </div>
          <div className="pt-2 border-t-2 border-gray-900 flex justify-between">
            <span className="font-black text-gray-900">Total</span>
            <span className="font-black text-primary">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mt-8">
          <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-2">
            Order Notes
          </div>
          <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
            {typeof order.notes === "string"
              ? order.notes
              : order.notes?.notes || "No special instructions provided."}
          </div>
        </div>
      )}

      <div className="mt-10 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400">
        Thank you for shopping with Lazapee · {formatDate(new Date().toISOString())}
      </div>
    </div>
  );
};

export default OrderInvoice;
