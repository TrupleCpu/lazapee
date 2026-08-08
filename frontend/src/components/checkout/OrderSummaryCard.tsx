import type { ReactNode } from "react";
import type { OrderTotals } from "../../lib/cart";
import { formatCurrency, parsePrice } from "../../lib/format";
import { getProductImage } from "../../lib/images";
import type { CartItem } from "../../types/cart";

interface OrderSummaryCardProps {
  totals: OrderTotals;
  items?: CartItem[];
  footer?: ReactNode;
  className?: string;
}

const OrderSummaryCard = ({
  totals,
  items,
  footer,
  className = "",
}: OrderSummaryCardProps) => {
  return (
    <div
      className={`bg-white/60 rounded-3xl border border-blue-100 p-6 sm:p-8 shadow-xs space-y-6 ${className}`}
    >
      <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

      {items && (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between space-x-3 p-2.5 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={getProductImage(item)}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-xl border border-gray-200/50 bg-white"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-bold text-primary shrink-0">
                {formatCurrency(parsePrice(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 pt-2 border-t border-blue-200/60 text-xs sm:text-sm">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Shipping Fee</span>
          <span className="font-bold text-gray-900">
            {totals.shipping > 0
              ? formatCurrency(totals.shipping)
              : "FREE"}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Tax (EST)</span>
          <span className="font-bold text-gray-900">
            {formatCurrency(totals.tax)}
          </span>
        </div>

        <div className="border-t border-blue-200/60 pt-4 flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(totals.total)}
          </span>
        </div>
      </div>

      {footer}
    </div>
  );
};

export default OrderSummaryCard;