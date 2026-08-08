export const ORDER_STATUSES = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatusKey =
  (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Preparing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const DEFAULT_BADGE_CLASS = "bg-gray-100 text-gray-600 border-gray-200";

export const getStatusBadgeClass = (status: string | undefined): string =>
  STATUS_BADGE_CLASSES[status ?? ""] ?? DEFAULT_BADGE_CLASS;

export const getStatusDotClass = (status: string | undefined): string => {
  const base = {
    Pending: "bg-amber-500",
    Confirmed: "bg-blue-500",
    Preparing: "bg-indigo-500",
    Shipped: "bg-sky-500",
    Completed: "bg-emerald-500",
    Delivered: "bg-emerald-500",
    Cancelled: "bg-red-500",
  } as Record<string, string>;

  return base[status ?? ""] ?? "bg-gray-400";
};