export const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === "number") return price;
  return parseFloat(String(price ?? "").replace(/[^0-9.-]+/g, "")) || 0;
};

export const formatCurrency = (
  value: number | string | undefined,
  fractionDigits = 2,
): string => {
  const num = typeof value === "number" ? value : parsePrice(value);
  if (Number.isNaN(num)) return "$0.00";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
};

export const formatPriceShort = (value: number | string | undefined): string => {
  const num = typeof value === "number" ? value : parsePrice(value);
  if (Number.isNaN(num) || num === 0) return "$0";
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const formatDate = (value: string | Date | undefined): string => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const timeAgo = (value: string | Date | undefined): string => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(value);
};

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");