"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListArticles,
  deleteArticle,
  type ArticleListItem,
} from "@/lib/articles";
import { formatDate } from "@/lib/utils";

export default function AdminArticlesPage() {
  const [items, setItems] = useState<ArticleListItem[]>([]);
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
      const data = await adminListArticles({ page, q: q || undefined });
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
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteArticle(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Articles & News</h1>
          <p className="text-muted text-sm mt-1">
            {total} {total === 1 ? "article" : "articles"} total
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Article
        </Link>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by title..."
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

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream text-xs uppercase text-muted tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Author</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-4 py-3 hidden lg:table-cell">Views</th>
              <th className="text-right px-4 py-3 hidden lg:table-cell">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted">
                  No articles yet.{" "}
                  <Link
                    href="/admin/articles/new"
                    className="text-secondary underline"
                  >
                    Create your first article
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-border hover:bg-cream/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-semibold text-primary hover:text-secondary"
                    >
                      {a.title}
                    </Link>
                    <div className="text-xs text-muted mt-0.5">/{a.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {a.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {a.author?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.isPublished ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-success/15 text-success rounded font-semibold">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-warning/15 text-warning rounded font-semibold">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted hidden lg:table-cell">
                    {a.viewCount}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted hidden lg:table-cell">
                    {a.updatedAt ? formatDate(a.updatedAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      {a.isPublished && (
                        <Link
                          href={`/news/${a.slug}`}
                          target="_blank"
                          className="px-2 py-1 text-xs text-secondary hover:underline"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="px-2 py-1 text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(a.id, a.title)}
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

      {/* Pagination */}
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
