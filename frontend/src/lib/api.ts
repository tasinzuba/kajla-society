const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  details?: unknown;
};

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok || body.success === false) {
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return (body.data ?? body) as T;
}
