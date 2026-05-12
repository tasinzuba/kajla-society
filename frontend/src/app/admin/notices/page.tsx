"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListNotices,
  deleteNotice,
  togglePin,
  type NoticeListItem,
} from "@/lib/notices";
import { formatDate } from "@/lib/utils";

export default function AdminNoticesPage() {
  const [items, setItems] = useState<NoticeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListNotices({ page, q: q || undefined });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string, title: string) {
    if (!confirm(`Delete notice "${title}"?`)) return;
    try {
      await deleteNotice(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  async function onTogglePin(id: string) {
    try {
      await togglePin(id);
      load();
    } catch (e) {
      alert(`Pin failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notices</h1>
          <p className="text-muted text-sm mt-1">
            {total} {total === 1 ? "notice" : "notices"} total
          </p>
        </div>
        <Link
          href="/admin/notices/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Notice
        </Link>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search notices..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className="w-full max-w-md px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream text-xs uppercase text-muted tracking-wider">
            <tr>
              <th className="text-center px-3 py-3 w-12">Pin</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Posted</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Attachment</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  No notices.{" "}
                  <Link
                    href="/admin/notices/new"
                    className="text-secondary underline"
                  >
                    Post your first notice
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr
                  key={n.id}
                  className={`border-t border-border hover:bg-cream/50 ${
                    n.isPinned ? "bg-accent/10" : ""
                  }`}
                >
                  <td className="text-center px-3 py-3">
                    <button
                      onClick={() => onTogglePin(n.id)}
                      title={n.isPinned ? "Unpin" : "Pin to top"}
                      className={`text-xl ${
                        n.isPinned ? "" : "opacity-30 hover:opacity-100"
                      }`}
                    >
                      📌
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/notices/${n.id}/edit`}
                      className="font-semibold text-primary hover:text-secondary"
                    >
                      {n.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {formatDate(n.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {n.attachment ? "📎" : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {n.isPublished ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-success/15 text-success rounded font-semibold">
                        Live
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-warning/15 text-warning rounded font-semibold">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      {n.isPublished && (
                        <Link
                          href={`/notices/${n.id}`}
                          target="_blank"
                          className="px-2 py-1 text-xs text-secondary hover:underline"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/notices/${n.id}/edit`}
                        className="px-2 py-1 text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(n.id, n.title)}
                        className="px-2 py-1 text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded ${
                p === page
                  ? "bg-primary text-white"
                  : "bg-surface border border-border hover:border-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
