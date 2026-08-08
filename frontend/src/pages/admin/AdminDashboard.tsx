import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { dashboardApi } from "../../lib/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { formatCurrency, formatDate, timeAgo } from "../../lib/format";
import type {
  DashboardStats,
  InventoryAlert,
  RecentOrder,
  SalesPoint,
} from "../../types";
import {
  DataTable,
  type Column,
  EmptyState,
  TableSkeleton,
} from "../../components/ui";
import Skeleton from "react-loading-skeleton";
import { NavLink, useNavigate } from "react-router";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600",
  Confirmed: "bg-emerald-50 text-emerald-600",
  Preparing: "bg-cyan-50 text-cyan-600",
  Shipped: "bg-indigo-50 text-indigo-600",
  Completed: "bg-blue-50 text-blue-600",
  Cancelled: "bg-rose-50 text-rose-500",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [chartTimeframe, setChartTimeframe] = useState<"weekly" | "monthly">(
    "monthly",
  );
  const [sales, setSales] = useState<SalesPoint[]>([]);

  const { data: statsData, loading: statsLoading } = useFetch<DashboardStats>(
    dashboardApi.stats,
  );
  const { data: recentOrdersData, loading: recentLoading } = useFetch<
    RecentOrder[]
  >(dashboardApi.recentOrders);
  const { data: inventoryData, loading: inventoryLoading } =
    useFetch<InventoryAlert>(dashboardApi.inventory);

  const loading = statsLoading || recentLoading || inventoryLoading;

  useEffect(() => {
    let cancelled = false;

    const fetchSales = async () => {
      try {
        const data = await dashboardApi.sales(chartTimeframe);
        if (!cancelled) setSales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load sales data:", error);
      }
    };

    fetchSales();
    return () => {
      cancelled = true;
    };
  }, [chartTimeframe]);

  const stats = statsData;
  const recentOrders = Array.isArray(recentOrdersData) ? recentOrdersData : [];
  const inventoryCount = inventoryData?.count ?? 0;

  const chartData = sales.map((point) => ({
    month: point.label,
    sales: point.sales,
  }));

  const growthBadge = (value: number) =>
    value < 0 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600";

  const displayNumber = (value: number | undefined) =>
    loading || value === undefined ? "-" : value.toLocaleString();

  const activities = recentOrders.slice(0, 3).map((order) => ({
    icon:
      order.status === "Completed" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      ),
    iconBg:
      order.status === "Completed"
        ? "bg-emerald-50 text-emerald-600"
        : "bg-blue-50 text-blue-600",
    text:
      order.status === "Completed"
        ? `Order ${order.order_number} completed`
        : `New order ${order.order_number} placed`,
    time: timeAgo(order.created_at),
    orderNumber: order.order_number,
  }));

  const columns: Column<RecentOrder>[] = [
    {
      key: "order_number",
      header: "Order ID",
      render: (order) => (
        <span className="font-bold text-gray-900">{order.order_number}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <div>
          <div className="font-bold text-gray-900">{order.customer_name}</div>
          <div className="text-[11px] text-gray-400">
            {order.customer_email}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (order) => (
        <span className="text-gray-500">{formatDate(order.created_at)}</span>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order) => <span className="text-gray-600">{order.items}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (order) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(order.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
            statusStyles[order.status] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          {order.status}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-50 text-[#1d4ed8] rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <span
              className={`${growthBadge(stats?.growth.products ?? 0)} text-[10px] font-bold px-1.5 py-0.5 rounded`}
            >
              {stats
                ? `${stats.growth.products >= 0 ? "+" : ""}${stats.growth.products}%`
                : "-"}
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Total Products
          </p>
          <h3 className="text-xl font-black text-gray-900 mt-1">
            {displayNumber(stats?.totalProducts)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-50 text-[#1d4ed8] rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span
              className={`${growthBadge(stats?.growth.orders ?? 0)} text-[10px] font-bold px-1.5 py-0.5 rounded`}
            >
              {stats &&
                `${stats.growth.orders >= 0 ? "+" : ""}${stats.growth.orders}%`}
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Total Orders
          </p>
          <h3 className="text-xl font-black text-gray-900 mt-1">
            {displayNumber(stats?.totalOrders)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
              Urgent
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Pending Orders
          </p>
          <h3 className="text-xl font-black text-gray-900 mt-1">
            {displayNumber(stats?.pendingOrders)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
              {loading ? "-" : `${stats?.completionRate ?? 0}%`}
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Completed
          </p>
          <h3 className="text-xl font-black text-gray-900 mt-1">
            {displayNumber(stats?.completedOrders)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span
              className={`${growthBadge(stats?.growth.customers ?? 0)} text-[10px] font-bold px-1.5 py-0.5 rounded`}
            >
              {stats &&
                `${stats.growth.customers >= 0 ? "+" : ""}${stats.growth.customers}%`}
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Total Customers
          </p>
          <h3 className="text-xl font-black text-gray-900 mt-1">
            {displayNumber(stats?.totalCustomers)}
          </h3>
        </div>

        <div className="bg-[#1d4ed8] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
              {stats &&
                `${stats.growth.sales >= 0 ? "+" : ""}${stats.growth.sales}%`}
            </span>
          </div>
          <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
            Total Sales
          </p>
          <h3 className="text-xl font-black text-white mt-1">
            {loading ? "-" : formatCurrency(stats?.totalSales ?? 0)}
          </h3>
        </div>
      </div>

      {/* Middle Section with Recharts BarChart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200/60 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Sales Overview
              </h3>
              <p className="text-xs text-gray-400">
                Monthly performance monitoring
              </p>
            </div>

            <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setChartTimeframe("weekly")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  chartTimeframe === "weekly"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartTimeframe("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  chartTimeframe === "monthly"
                    ? "bg-[#1d4ed8] text-white shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.sales ===
                        Math.max(...chartData.map((d) => d.sales))
                          ? "#002b9a"
                          : "#dbeafe"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-2">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base">Inventory Alert</h3>
            </div>
            <p className="text-xs text-emerald-900/80 mb-4 leading-relaxed">
              <strong className="font-bold">
                {loading ? "-" : inventoryCount}
              </strong>{" "}
              product{inventoryCount === 1 ? "" : "s"} running low on stock.
              Restock suggested soon.
            </p>
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-[#004d40] hover:bg-emerald-950 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Review Stock
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={12} />
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <p className="text-xs text-gray-400">No recent activity.</p>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate(
                        `/admin/orders/details/${activity.orderNumber}`,
                      )
                    }
                    className="flex items-start space-x-3 cursor-pointer group"
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${activity.iconBg}`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {activity.text}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Overview of latest transactions across all channels
            </p>
          </div>
          <NavLink
            to="/admin/orders"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1d4ed8] hover:underline"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <DataTable
            columns={columns}
            rows={recentOrders}
            getRowKey={(row) => row.id}
            onRowClick={(order) =>
              navigate(`/admin/orders/details/${order.order_number}`)
            }
            emptyState={
              <EmptyState icon={ShoppingCart} title="No orders yet" />
            }
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
