"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiStar } from "react-icons/hi2";
import {
  adminListTestimonials,
  deleteTestimonial,
  type Testimonial,
} from "@/lib/testimonials";
import { mediaUrl } from "@/lib/media";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    adminListTestimonials()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Testimonials</h1>
          <p className="text-sm text-muted mt-1">
            Shown in the &ldquo;Loved by our residents&rdquo; homepage section.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-amber-400 text-primary-dark rounded-lg hover:bg-amber-300 transition font-bold text-sm"
        >
          + New Testimonial
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-border rounded-md p-16 text-center text-muted">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-border rounded-md p-16 text-center">
          <p className="text-muted">
            No testimonials yet. Add one — the homepage section stays hidden
            until at least one is added.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => {
            const avatar = mediaUrl(t.avatar);
            return (
              <div
                key={t.id}
                className="bg-white border border-border rounded-md p-5 flex flex-col"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map(
                    (_, s) => (
                      <HiStar key={s} className="text-amber-400 text-sm" />
                    )
                  )}
                  {!t.isActive && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-muted font-bold bg-background px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-background grid place-items-center flex-shrink-0">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-primary">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-primary-dark text-sm truncate">
                      {t.name}
                    </div>
                    {t.role && (
                      <div className="text-xs text-muted truncate">{t.role}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/testimonials/${t.id}/edit`}
                    className="flex-1 text-center px-3 py-1.5 border border-border rounded text-xs font-bold hover:border-amber-400 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="px-3 py-1.5 text-xs text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
