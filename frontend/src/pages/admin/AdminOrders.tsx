import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Eye,
  Trash2,
  Van,
  Wallet,
  Building2,
  ShoppingCart,
  Clock,
  Truck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ordersApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order } from "../../types";
import {
  type Column,
  ConfirmDialog,
  Pagination,
  StatCard,
  EmptyState,
  PageHeader,
  TableSkeleton,
} from "../../components/ui";

const ORDER_STATUS_OPTIONS = [
  "Confirmed",
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusBadgeClass = (status: string): string => {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-50 text-emerald-600";
    case "Pending":
      return "bg-amber-50 text-amber-600";
    case "Shipped":
      return "bg-indigo-50 text-indigo-600";
    case "Delivered":
      return "bg-blue-50 text-blue-600";
    default:
      return "bg-rose-50 text-rose-500";
  }
};

const paymentTypeIcon = (payment_type?: string | null) => {
  const type = payment_type?.toLowerCase() || "";
  if (type.includes("wallet") || type.includes("ewallet"))
    return <Wallet className="w-4 h-4" />;
  if (type.includes("bank")) return <Building2 className="w-4 h-4" />;
  return <Van className="w-4 h-4" />;
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch(ordersApi.list);
  const { isPending: isDeleting, run: runDelete } = useAsyncAction();

  const ordersData = useMemo(() => data ?? [], [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const openDeleteModal = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setOrderToDelete(order);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    const result = await runDelete(() =>
      ordersApi.remove(orderToDelete.order_number),
    );
    if (result == null) {
      alert("Failed to delete order. Please try again.");
      return;
    }
    setOrderToDelete(null);
    await refetch();
  };

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All Statuses" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currOrders = filteredOrders.slice(startIndex, endIndex);

  const totalOrdersRevenue = ordersData.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const totalPendingOrders = ordersData.filter(
    (order) => order.status === "Pending",
  ).length;
  const totalTransitOrders = ordersData.filter(
    (order) => order.status === "Shipped",
  ).length;

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      header: "Order ID",
      render: (order) => (
        <span className="font-black text-primary">{order.order_number}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <div>
          <div className="font-bold text-gray-900 text-xs sm:text-sm">
            {order.customer_name}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {order.customer_email}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (order) => (
        <span className="text-gray-600 font-medium">
          {formatDate(order.created_at)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (order) => (
        <span className="font-black text-gray-900">
          {formatCurrency(order.total)}
        </span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      render: (order) => (
        <div className="flex items-center space-x-2 text-gray-600">
          {paymentTypeIcon(order.payment_type)}
          <span>{order.payment_type}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadgeClass(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (order) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/orders/details/${order.order_number}`);
            }}
            className="p-1.5 text-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View order details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => openDeleteModal(e, order)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleDownloadCSV = async () => {
    if (!filteredOrders.length) return;

    // Define CSV headers
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Date",
      "Total",
      "Payment Type",
      "Status",
    ];

    // Map orders data to CSV rows and handle double quotes escaping
    const rows = filteredOrders.map((order) => [
      `"${(order.order_number || "").replace(/"/g, '""')}"`,
      `"${(order.customer_name || "").replace(/"/g, '""')}"`,
      `"${(order.customer_email || "").replace(/"/g, '""')}"`,
      `"${order.created_at ? formatDate(order.created_at) : ""}"`,
      `"${order.total ?? 0}"`,
      `"${(order.payment_type || "").replace(/"/g, '""')}"`,
      `"${(order.status || "").replace(/"/g, '""')}"`,
    ]);

    // Combine headers and rows into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob and trigger trigger client-side download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const filename = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Order Management"
        description="Monitor and update customer orders across all regions."
        actions={
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-gray-200/60 p-4 sm:p-5 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96 flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-surface border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="relative w-full sm:w-auto min-w-[150px]">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full appearance-none bg-surface border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary focus:bg-white cursor-pointer transition-all"
            >
              <option value="All Statuses">All Statuses</option>
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      {loading ? (
        <TableSkeleton rows={6} columns={6} className="mb-8" />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-gray-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 ${
                        column.align === "right"
                          ? "text-right"
                          : column.align === "center"
                            ? "text-center"
                            : "text-left"
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {currOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center"
                    >
                      <EmptyState icon={Search} title="No orders found" />
                    </td>
                  </tr>
                ) : (
                  currOrders.map((order) => (
                    <tr
                      role="button"
                      onClick={() =>
                        navigate(`/admin/orders/details/${order.order_number}`)
                      }
                      key={order.order_number}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-6 py-4 ${
                            column.align === "right"
                              ? "text-right"
                              : column.align === "center"
                                ? "text-center"
                                : "text-left"
                          }`}
                        >
                          {column.render(order)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Dynamic Pagination */}
          <div className="px-6 py-4 bg-surface border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Showing{" "}
              <span className="font-bold text-gray-800">
                {filteredOrders.length > 0 ? startIndex + 1 : 0}–{" "}
                {Math.min(endIndex, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800">
                {filteredOrders.length}
              </span>{" "}
              orders
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom Summary Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${totalOrdersRevenue.toLocaleString()}`}
          icon={ShoppingCart}
          iconClassName="bg-blue-50 text-primary"
        />
        <StatCard
          label="Pending"
          value={`${totalPendingOrders} Orders`}
          icon={Clock}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="In Transit"
          value={`${totalTransitOrders} Orders`}
          icon={Truck}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          label="Critical"
          value="3 Alerts"
          icon={AlertCircle}
          iconClassName="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={orderToDelete !== null}
        title="Delete Order"
        pending={isDeleting}
        message={`Are you sure you want to delete order ${orderToDelete?.order_number} placed by ${orderToDelete?.customer_name}? This action cannot be undone.`}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDeleteOrder}
        confirmLabel="Delete Order"
      />
    </>
  );
};

export default AdminOrders;
