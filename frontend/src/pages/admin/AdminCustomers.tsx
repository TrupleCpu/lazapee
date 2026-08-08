import { useMemo } from "react";
import {
  Users,
  UserCheck,
  ShoppingBag,
} from "lucide-react";
import { customersApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { formatCurrency } from "../../lib/format";
import type { Customer } from "../../types";
import {
  DataTable,
  type Column,
  EmptyState,
  PageHeader,
  StatCard,
  TableSkeleton,
} from "../../components/ui";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarBg = (key?: string) => {
  const colors = [
    "bg-[#1d4ed8] text-white",
    "bg-emerald-100 text-emerald-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
  ];
  const charCodeSum = (key || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const AdminCustomers = () => {
  const { data, loading } = useFetch(customersApi.list);
  const customers: Customer[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const totalCustomersCount = customers.length;
  const activeCustomersCount = customers.filter(
    (c) => c.status?.toLowerCase() === "active",
  ).length;
  const totalRevenue = customers.reduce(
    (acc, c) => acc + (Number(c.totalPurchase) || 0),
    0,
  );
  const totalOrders = customers.reduce(
    (acc, c) => acc + (Number(c.orderCount) || 0),
    0,
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const columns: Column<Customer>[] = [
    {
      key: "customer",
      header: "Customer Name",
      render: (customer) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarBg(
              String(customer.id),
            )}`}
          >
            {getInitials(customer.name)}
          </div>
          <span className="font-bold text-gray-900 text-xs sm:text-sm">
            {customer.name}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email Address",
      render: (customer) => (
        <span className="text-gray-600 font-normal">{customer.email}</span>
      ),
    },
    {
      key: "contact",
      header: "Contact Number",
      render: (customer) => (
        <span className="text-gray-600 font-normal whitespace-pre-line">
          {customer.contactNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      render: (customer) => (
        <span className="font-semibold text-gray-800">
          {customer.orderCount ?? 0}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total Purchase",
      render: (customer) => (
        <span className="font-black text-gray-900">
          {formatCurrency(Number(customer.totalPurchase))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => {
        const isActive = customer.status?.toLowerCase() === "active";
        const isPending = customer.status?.toLowerCase() === "pending";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : isPending
                  ? "bg-amber-50 text-amber-600"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {customer.status || "Inactive"}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Customer Directory"
        description="Manage user accounts, monitor purchase history, and update status."
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Customers"
          value={loading ? "-" : totalCustomersCount.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Active Users"
          value={loading ? "-" : activeCustomersCount.toLocaleString()}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
          trend={
            totalCustomersCount > 0
              ? `${Math.round((activeCustomersCount / totalCustomersCount) * 100)}% of total`
              : "0%"
          }
        />
        <StatCard
          label="Avg. Order Value"
          value={loading ? "-" : formatCurrency(avgOrderValue)}
          icon={ShoppingBag}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <div className="bg-primary text-white p-5 rounded-2xl shadow-xs">
          <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
            Total Revenue
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-2xl font-black text-white">
              {loading ? "-" : formatCurrency(totalRevenue)}
            </h4>
            <span className="text-[11px] font-medium text-blue-200">
              LTV Total
            </span>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden">
        {/* Table Action Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-800">
              {customers.length > 0 ? 1 : 0}-{customers.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">{customers.length}</span>{" "}
            customers
          </div>
        </div>

        {/* Customer Table */}
        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : (
          <DataTable
            columns={columns}
            rows={customers}
            getRowKey={(row) => row.id}
            emptyState={<EmptyState icon={Users} title="No customers found" />}
          />
        )}
      </div>
    </>
  );
};

export default AdminCustomers;
