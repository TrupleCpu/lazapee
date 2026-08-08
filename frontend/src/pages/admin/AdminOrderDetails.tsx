import { useEffect, useState } from "react";
import {
  ChevronRight,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  FileText,
  PackageCheck,
  ArrowLeft,
  Banknote,
  Wallet,
  Building2,
  Loader2,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ordersApi } from "../../lib/endpoints";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { formatCurrency } from "../../lib/format";
import { Button, ConfirmDialog } from "../../components/ui";
import OrderInvoice, {
  type InvoiceOrder,
} from "../../components/admin/OrderInvoice";
import { generatePdfInvoice } from "../../lib/pdf";
import Skeleton from "react-loading-skeleton";

interface LocalOrderItem {
  id: string | number;
  name: string;
  image: string;
  sku: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: string | number;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_type: string;
  created_at: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: { notes?: string } | string | null;
  order_items: LocalOrderItem[];
}

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Completed",
  "Cancelled",
];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-600";
    case "Confirmed":
      return "bg-emerald-50 text-emerald-600";
    case "Preparing":
      return "bg-cyan-50 text-cyan-600";
    case "Shipped":
      return "bg-indigo-50 text-indigo-600";
    case "Completed":
      return "bg-blue-50 text-blue-600";
    case "Cancelled":
      return "bg-rose-50 text-rose-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const renderPaymentMethod = (type: string) => {
  const normalizedType = type?.toLowerCase() || "";

  let config = {
    title: type || "Cash on Delivery",
    subtitle: "Pay cash upon receiving items",
    icon: Banknote,
    iconBg: "bg-amber-100 text-amber-700",
  };

  if (normalizedType.includes("wallet") || normalizedType.includes("ewallet")) {
    config = {
      title: type,
      subtitle: "Digital Wallet Payment",
      icon: Wallet,
      iconBg: "bg-blue-100 text-blue-700",
    };
  } else if (normalizedType.includes("bank")) {
    config = {
      title: type,
      subtitle: "Direct Bank Transfer",
      icon: Building2,
      iconBg: "bg-purple-100 text-purple-700",
    };
  }

  const IconComponent = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${config.iconBg} shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-xs sm:text-sm">
              {config.title}
            </div>
            <div className="text-[11px] font-medium text-gray-400">
              {config.subtitle}
            </div>
          </div>
        </div>
      </div>

      {normalizedType.includes("cod") && (
        <p className="text-[11px] text-gray-500 bg-amber-50/60 p-3 rounded-xl border border-amber-100/60 leading-relaxed">
          dY'z Courier will collect payment in cash upon delivery.
        </p>
      )}
    </div>
  );
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPending: isDeleting, run: runDelete } = useAsyncAction();
  const { isPending: isUpdating, run: runUpdate } = useAsyncAction();

  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const getOrderDetail = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      try {
        const data = await ordersApi.getDetails(id);
        setOrderDetail(data as unknown as OrderDetail);
        setOrderStatus(data.status || "");
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    const previousStatus = orderStatus;
    setOrderStatus(newStatus);

    if (!orderDetail) return;
    const result = await runUpdate(() =>
      ordersApi.updateStatus(orderDetail.id, newStatus),
    );
    if (result == null) {
      setOrderStatus(previousStatus);
      alert("Failed to update order status. Please try again.");
      return;
    }
    setOrderDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const confirmDeleteOrder = async () => {
    if (!orderDetail) return;
    const result = await runDelete(() => ordersApi.remove(orderDetail.id));
    if (result == null) {
      alert("Failed to delete order. Please try again.");
      return;
    }
    setIsDeleteModalOpen(false);
    navigate("/admin/orders");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!orderDetail) return;
    generatePdfInvoice(orderDetail as unknown as InvoiceOrder);
  };

  if (loading) {
    return (
      <div className="bg-[#f3f6fc] min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4 space-y-6">
          <Skeleton width={140} height={20} />
          <Skeleton width="45%" height={28} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 space-y-3">
                <Skeleton width={160} height={14} />
                <Skeleton width="90%" height={14} />
                <Skeleton width="70%" height={14} />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={64} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs p-6 space-y-3">
                <Skeleton width={120} height={14} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
              <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs p-6 space-y-3">
                <Skeleton width={120} height={14} />
                <Skeleton count={3} height={14} containerClassName="space-y-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetail || notFound) {
    return (
      <div className="bg-[#f3f6fc] min-h-screen flex flex-col items-center justify-center text-rose-500 font-semibold gap-3">
        <p>Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-xs bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="print:hidden">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-4">
          <span
            onClick={() => navigate("/admin/orders")}
            className="hover:text-gray-800 transition-colors cursor-pointer"
          >
            Orders
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-primary font-bold">Order Details</span>
        </div>

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200/80 transition-all shadow-2xs cursor-pointer"
            title="Back to orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                {orderDetail.order_number}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(
                  orderStatus,
                )}`}
              >
                {orderStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Placed on {new Date(orderDetail.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrintInvoice}
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Invoice</span>
          </button>
          <Button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 text-xs rounded-xl"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-100 transition-all cursor-pointer"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <PackageCheck className="w-5 h-5 text-primary" />
                <span>Ordered Products</span>
              </h2>
              <span className="text-xs font-semibold text-gray-400">
                {orderDetail.order_items?.length || 0} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface text-gray-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {Array.isArray(orderDetail.order_items) &&
                    orderDetail.order_items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200/60 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-gray-900 text-xs sm:text-sm">
                                {item.name}
                              </div>
                              <div className="text-[10px] uppercase font-bold text-gray-400 mt-0.5 tracking-wider">
                                SKU: {item.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {formatCurrency(item.price || 0)}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-900">
                          <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-gray-900">
                          {formatCurrency((item.price || 0) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-surface border-t border-gray-100 flex justify-end">
              <div className="w-full max-w-xs space-y-3 text-xs">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(orderDetail.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping Fee</span>
                  {orderDetail.shipping > 0 ? (
                    <span className="font-bold text-black">
                      {formatCurrency(orderDetail.shipping)}
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600">Free</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(orderDetail.tax)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                  <span className="font-extrabold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-black text-base text-primary">
                    {formatCurrency(orderDetail.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Order Notes</span>
            </h2>
            <div className="p-4 bg-surface rounded-2xl border border-gray-200/60 text-xs text-gray-700 leading-relaxed font-medium">
              {typeof orderDetail.notes === "string"
                ? orderDetail.notes
                : orderDetail.notes?.notes ||
                  "No special instructions provided."}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Update Order Status
              </h2>
              {isUpdating && (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              )}
            </div>
            <select
              disabled={isUpdating}
              value={orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full appearance-none bg-surface border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-primary focus:bg-white cursor-pointer transition-all disabled:opacity-50"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-blue-100 text-primary">
                {orderDetail.customer_name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-extrabold text-gray-900 text-sm">
                  {orderDetail.customer_name}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  Customer
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium truncate">
                  {orderDetail.customer_email}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium">
                  {orderDetail.customer_phone}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-primary" />
              <span>Delivery Address</span>
            </h2>
            <div className="flex items-start space-x-3 text-xs text-gray-700 font-medium leading-relaxed">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p>{orderDetail.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Payment Method</span>
            </h2>

            {renderPaymentMethod(
              orderDetail.payment_type || "Cash on Delivery",
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Printable invoice (hidden on screen, shown only when printing) */}
      <div className="hidden print:block">
        <OrderInvoice order={orderDetail as unknown as InvoiceOrder} />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={isDeleteModalOpen}
        title="Delete Order"
        pending={isDeleting}
        message={`Are you sure you want to delete order ${orderDetail.order_number} placed by ${orderDetail.customer_name}? This action cannot be undone.`}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteOrder}
        confirmLabel="Delete Order"
      />
    </>
  );
};

export default AdminOrderDetails;