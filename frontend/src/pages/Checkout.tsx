import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import {
  Truck,
  CreditCard,
  Building2,
  Wallet,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { ordersApi, type CreateOrderPayload } from "../lib/endpoints";
import { calculateOrderTotals } from "../lib/cart";
import { formatCurrency } from "../lib/format";
import type { CartItem, PaymentMethod } from "../types";
import { TextInput, TextArea, Button } from "../components/ui";
import {
  OrderSummaryCard,
  PaymentMethodOption,
} from "../components/checkout";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  orderNotes: string;
}

const initialFormData: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  orderNotes: "",
};

const Checkout = () => {
  const { cart, completeCheckOut } = useCart();

  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);

  const totals = calculateOrderTotals(cart);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    const orderData: CreateOrderPayload = {
      ...formData,
      paymentMethod,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      cart: cart.map((item) => ({
        id: String(item.id),
        title: item.title,
        slug: item.slug,
        images: item.images ?? [item.image ?? ""],
        price: item.price,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);
    try {
      const data = await ordersApi.create(orderData);
      setOrderId((data as { order_number?: string })?.order_number || "");
      setOrderSummary(cart);
      setIsSubmitted(true);
      completeCheckOut();
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#f1f5f9] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Order Placed!</h2>
          <p className="text-gray-500 text-sm">
            Thank you,{" "}
            <span className="font-semibold text-gray-800">
              {formData.fullName || "Customer"}
            </span>
            . Your order has been successfully processed.
          </p>
          <p className="text-gray-500">Order ID: {orderId || "—"}</p>

          {orderSummary.length > 0 && (
            <div className="w-full text-left bg-gray-50 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
              <ul className="space-y-2">
                {orderSummary.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm text-gray-700"
                  >
                    <span className="truncate pr-2">
                      {item.title}
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <Link to="/products">
              <Button fullWidth>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5f9] min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Please complete your details to finalize your order.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/60 p-12 text-center shadow-xs">
            <p className="text-gray-500 text-base mb-6">
              Your cart is empty. Add items to your cart before proceeding to
              checkout.
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="w-4 h-4" />
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Details */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Full Name"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <TextInput
                    label="Email Address"
                    type="email"
                    name="email"
                    required
                    placeholder="john@cubetech.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <TextInput
                    label="Contact Number"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <TextInput
                    label="City"
                    name="city"
                    required
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <div className="sm:col-span-2">
                    <TextInput
                      label="Delivery Address"
                      name="address"
                      required
                      placeholder="123 Cube Street, Tech District"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <PaymentMethodOption
                    label="COD"
                    icon={CreditCard}
                    value="cod"
                    selected={paymentMethod === "cod"}
                    onSelect={(value) => setPaymentMethod(value as PaymentMethod)}
                  />
                  <PaymentMethodOption
                    label="E-Wallet"
                    icon={Wallet}
                    value="ewallet"
                    selected={paymentMethod === "ewallet"}
                    onSelect={(value) => setPaymentMethod(value as PaymentMethod)}
                  />
                  <PaymentMethodOption
                    label="Bank Transfer"
                    icon={Building2}
                    value="bank"
                    selected={paymentMethod === "bank"}
                    onSelect={(value) => setPaymentMethod(value as PaymentMethod)}
                  />
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Order Notes{" "}
                    <span className="text-gray-400 font-normal text-sm">
                      (Optional)
                    </span>
                  </h2>
                </div>

                <TextArea
                  name="orderNotes"
                  rows={3}
                  placeholder="Notes about your order, e.g. special instructions for delivery."
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <OrderSummaryCard
                totals={totals}
                items={cart}
                footer={
                  <>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      className="py-4 rounded-2xl"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? "Placing Order..." : "Place Order"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Secure 256-bit SSL encrypted checkout</span>
                    </div>
                  </>
                }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;