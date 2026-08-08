import { Link, useNavigate } from "react-router";
import { ArrowLeft, Lock, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { calculateOrderTotals } from "../lib/cart";
import { formatCurrency, parsePrice } from "../lib/format";
import { getProductImage } from "../lib/images";
import QuantityStepper from "../components/store/QuantityStepper";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalItems } = useCart();
  const navigate = useNavigate();

  const { subtotal, shipping, tax, total } = calculateOrderTotals(cart);

  return (
    <section className="bg-surface min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-7xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You have {totalItems} {totalItems === 1 ? "item" : "items"} in your
            cart.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <EmptyState
              icon={ArrowLeft}
              title="Your cart is currently empty."
              action={
                <Link to="/products">
                  <Button>
                    <ArrowLeft className="w-4 h-4" />
                    Explore Products
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#f1f5f9] grid grid-cols-12 px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Price</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 px-6 py-6 items-center gap-2"
                  >
                    <div className="col-span-6 flex items-center space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pr-2">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.subtitle || item.category}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-center">
                      <QuantityStepper
                        compact
                        quantity={item.quantity}
                        min={0}
                        onDecrement={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        onIncrement={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      />
                    </div>

                    <div className="col-span-3 flex items-center justify-end space-x-3 sm:space-x-6">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {formatCurrency(parsePrice(item.price) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {shipping > 0 ? formatCurrency(shipping) : "FREE"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure encrypted checkout</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
