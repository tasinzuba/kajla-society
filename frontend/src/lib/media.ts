const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(
    /\/api$/,
    ""
  );

/** Resolve a stored media path (e.g. `/uploads/2026/05/foo.jpg`) to a full URL. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
