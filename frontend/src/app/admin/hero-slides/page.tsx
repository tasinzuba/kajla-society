"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListHeroSlides,
  deleteHeroSlide,
  toggleHeroSlideActive,
  type HeroSlide,
} from "@/lib/hero-slides";
import { mediaUrl } from "@/lib/media";

export default function AdminHeroSlidesPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListHeroSlides());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string) {
    if (!confirm("Delete this slide?")) return;
    try {
      await deleteHeroSlide(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  async function onToggle(id: string) {
    try {
      await toggleHeroSlideActive(id);
      load();
    } catch (e) {
      alert(`Toggle failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Hero Slider</h1>
          <p className="text-muted text-sm mt-1">
            {items.length} {items.length === 1 ? "slide" : "slides"} · shown on the homepage hero
          </p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Slide
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-surface border border-border rounded-lg py-16 text-center text-muted">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg py-16 text-center text-muted">
          No slides yet.{" "}
          <Link
            href="/admin/hero-slides/new"
            className="text-secondary underline"
          >
            Add your first slide
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((s) => {
            const src = mediaUrl(s.image);
            return (
              <div
                key={s.id}
                className={`bg-surface border rounded-lg overflow-hidden flex flex-col sm:flex-row ${
                  s.isActive ? "border-border" : "border-border opacity-60"
                }`}
              >
                <div className="relative w-full sm:w-72 aspect-[16/9] flex-shrink-0 bg-black">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={s.title ?? "Hero slide"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/40 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-muted font-semibold">
                        Order #{s.order}
                      </div>
                      <div className="text-lg font-bold text-primary mt-0.5">
                        {s.title || <span className="italic text-muted">Untitled slide</span>}
                      </div>
                      {s.subtitle && (
                        <div className="text-sm text-muted mt-1 line-clamp-2">
                          {s.subtitle}
                        </div>
                      )}
                      {s.ctaLabel && s.ctaHref && (
                        <div className="text-xs text-emerald-dark mt-2">
                          → <span className="font-semibold">{s.ctaLabel}</span>{" "}
                          <span className="text-muted">links to {s.ctaHref}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold flex-shrink-0 ${
                        s.isActive
                          ? "bg-success/15 text-success"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {s.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border">
                    <button
                      onClick={() => onToggle(s.id)}
                      className="px-3 py-1.5 text-xs border border-border rounded hover:bg-cream transition"
                    >
                      {s.isActive ? "Hide" : "Show"}
                    </button>
                    <Link
                      href={`/admin/hero-slides/${s.id}/edit`}
                      className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="px-3 py-1.5 text-xs text-danger hover:bg-danger/10 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
