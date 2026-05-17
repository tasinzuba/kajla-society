"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createHeroSlide,
  updateHeroSlide,
  type HeroSlide,
  type HeroSlideInput,
} from "@/lib/hero-slides";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = { initial?: HeroSlide };

export function HeroSlideForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [image, setImage] = useState(initial?.image ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleBn, setTitleBn] = useState(initial?.titleBn ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [subtitleBn, setSubtitleBn] = useState(initial?.subtitleBn ?? "");
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(initial?.ctaHref ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const token = getToken();
      const res = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message ?? "Upload failed");
      setImage(body.data.url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit() {
    setError(null);
    if (!image) return setError("Image is required");
    setSubmitting(true);

    const input: HeroSlideInput = {
      image,
      title: title.trim() || null,
      titleBn: titleBn.trim() || null,
      subtitle: subtitle.trim() || null,
      subtitleBn: subtitleBn.trim() || null,
      ctaLabel: ctaLabel.trim() || null,
      ctaHref: ctaHref.trim() || null,
      order,
      isActive,
    };

    try {
      if (isEdit) await updateHeroSlide(initial!.id, input);
      else await createHeroSlide(input);
      router.push("/admin/hero-slides");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  const previewSrc = mediaUrl(image);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/hero-slides" className="text-sm text-muted hover:text-primary">
            ← Back to hero slides
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Hero Slide" : "New Hero Slide"}
          </h1>
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
        {/* Image upload + live preview */}
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Slide Image <span className="text-danger">*</span>
          </label>

          {previewSrc ? (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden border border-border bg-black mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Slide preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {(title || subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                  {title && (
                    <div className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {title}
                    </div>
                  )}
                  {subtitle && (
                    <div className="text-sm lg:text-base text-white/85 mt-2 max-w-xl">
                      {subtitle}
                    </div>
                  )}
                  {ctaLabel && (
                    <span className="mt-3 inline-flex w-fit px-4 py-2 bg-emerald text-white text-xs font-bold uppercase tracking-wider rounded-md">
                      {ctaLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[16/7] rounded-xl border-2 border-dashed border-border grid place-items-center text-muted text-sm mb-3">
              No image uploaded
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f);
              e.target.value = "";
            }}
          />
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-dashed border-border rounded text-sm text-muted hover:border-secondary hover:text-secondary transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : image ? "Change image" : "+ Upload image"}
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                className="px-3 py-2 text-sm text-danger hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted mt-2">
            Recommended: wide landscape image, at least 1920×1080px. Will fill full screen height.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Welcome to Kajla Society"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title (বাংলা)
            </label>
            <input
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              lang="bn"
              placeholder="যেমনঃ কাজলা সোসাইটিতে স্বাগতম"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Short tagline shown below the title"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Subtitle (বাংলা)
            </label>
            <textarea
              rows={2}
              value={subtitleBn}
              onChange={(e) => setSubtitleBn(e.target.value)}
              lang="bn"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Button Label
            </label>
            <input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="e.g. Become a Member"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Button Link
            </label>
            <input
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/services/membership or https://..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
            <p className="text-[11px] text-muted mt-1">Lower numbers show first.</p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Active (show on homepage)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
