"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListGalleries,
  deleteGallery,
  type GallerySummary,
} from "@/lib/galleries";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";

export default function AdminGalleriesListPage() {
  const [items, setItems] = useState<GallerySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListGalleries());
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
    if (!confirm(`Delete "${title}" and all its media?`)) return;
    try {
      await deleteGallery(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Galleries</h1>
          <p className="text-muted text-sm mt-1">
            {items.length} {items.length === 1 ? "album" : "albums"} total
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Album
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <p className="text-muted">No albums yet.</p>
          <Link
            href="/admin/gallery/new"
            className="inline-block mt-3 text-secondary underline text-sm"
          >
            Create your first album
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((g) => (
            <div
              key={g.id}
              className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <Link href={`/admin/gallery/${g.id}`}>
                <div className="aspect-video bg-cream relative">
                  {g.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(g.coverImage) ?? ""}
                      alt={g.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-secondary/40 text-5xl">
                      {g.type === "VIDEO" ? "▶" : "🖼"}
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 text-[10px] uppercase tracking-wider rounded font-semibold ${
                      g.type === "VIDEO"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {g.type}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {g._count.media} items
                  </span>
                </div>
              </Link>
              <div className="p-4">
                <Link
                  href={`/admin/gallery/${g.id}`}
                  className="font-bold text-primary hover:text-secondary"
                >
                  {g.title}
                </Link>
                <div className="text-xs text-muted mt-1">
                  /{g.slug} · {formatDate(g.createdAt)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/gallery/${g.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Manage
                  </Link>
                  <Link
                    href={`/media/${g.slug}`}
                    target="_blank"
                    className="text-xs text-secondary hover:underline"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => onDelete(g.id, g.title)}
                    className="text-xs text-danger hover:underline ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
