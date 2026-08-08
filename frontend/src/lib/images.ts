const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400&auto=format&fit=crop";

type ImageSource = {
  images?: (string | null)[] | null;
  image?: string | null;
};

export const getProductImage = (source?: ImageSource): string =>
  (source?.images?.[0] as string | undefined) ?? source?.image ?? FALLBACK_IMAGE;

const isObjectUrl = (url: string): boolean => url.startsWith("blob:");

export const normalizeImageUrl = (
  value: string | { url?: string } | undefined | null,
): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.url;
};

export const revokeObjectUrls = (urls: string[] | undefined): void => {
  urls?.filter(isObjectUrl).forEach((url) => URL.revokeObjectURL(url));
};