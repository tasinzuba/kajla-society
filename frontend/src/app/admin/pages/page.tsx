"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminListPages, deletePage, type PageSummary } from "@/lib/pages";
import { formatDate } from "@/lib/utils";

const PROTECTED = new Set(["home", "about", "contact"]);

export default function AdminPagesListPage() {
  const [items, setItems] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListPages());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deletePage(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Pages</h1>
          <p className="text-muted text-sm mt-1">
            Edit static pages (About, Contact, etc.) or add new ones.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Page
        </Link>
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
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Slug</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted">No pages.</td></tr>
            ) : (
              items.map((p) => {
                const isProtected = PROTECTED.has(p.slug);
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pages/${p.id}/edit`}
                        className="font-semibold text-primary hover:text-secondary"
                      >
                        {p.title}
                      </Link>
                      {isProtected && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-accent/40 text-primary rounded font-semibold">
                          system
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted hidden md:table-cell">
                      <code className="bg-cream px-2 py-0.5 rounded">/{p.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isPublished ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-success/15 text-success rounded font-semibold">
                          Live
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-warning/15 text-warning rounded font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted hidden md:table-cell">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {p.isPublished && (
                          <Link
                            href={p.slug === "home" ? "/" : `/${p.slug}`}
                            target="_blank"
                            className="px-2 py-1 text-xs text-secondary hover:underline"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/pages/${p.id}/edit`}
                          className="px-2 py-1 text-xs text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        {!isProtected && (
                          <button
                            onClick={() => onDelete(p.id, p.title)}
                            className="px-2 py-1 text-xs text-danger hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
