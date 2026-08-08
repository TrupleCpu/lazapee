export const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Thin wrapper around `fetch` so the whole app talks to the backend
 * through one place. Relative paths resolve against `API_BASE`, and
 * authenticated endpoints send cookies by default.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { credentials, headers, body, ...rest } = options;

  const init: RequestInit = {
    ...rest,
    credentials: credentials ?? "include",
    headers: {
      ...(body && typeof body === "object" && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
  };

  if (body != null) {
    if (typeof body === "string" || body instanceof FormData || body instanceof Blob) {
      init.body = body;
    } else if (typeof body === "object") {
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    let parsed: unknown;
    try {
      parsed = await response.json();
    } catch {
      parsed = undefined;
    }
    const message =
      (parsed as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, parsed);
  }

  return (await response.json()) as T;
}