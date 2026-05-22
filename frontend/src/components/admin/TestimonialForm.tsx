"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createTestimonial,
  updateTestimonial,
  type Testimonial,
  type TestimonialInput,
} from "@/lib/testimonials";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const inputCls =
  "w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-400";
const labelCls = "block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider";

export function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [avatar, setAvatar] = useState(initial?.avatar ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadAvatar(file: File) {
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
      setAvatar(body.data.url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit() {
    setError(null);
    if (!name.trim()) return setError("Name is required");
    if (!quote.trim()) return setError("Quote is required");
    setSubmitting(true);
    const input: TestimonialInput = {
      name: name.trim(),
      role: role.trim() || null,
      quote: quote.trim(),
      avatar: avatar || null,
      rating,
      order,
      isActive,
    };
    try {
      if (isEdit) await updateTestimonial(initial!.id, input);
      else await createTestimonial(input);
      router.push("/admin/testimonials");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  const preview = avatar ? mediaUrl(avatar) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/testimonials" className="text-sm text-muted hover:text-primary">
            ← Back to testimonials
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Testimonial" : "New Testimonial"}
          </h1>
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="px-4 py-2 bg-amber-400 text-primary-dark rounded-lg hover:bg-amber-300 transition text-sm font-bold disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role / Subtitle</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Resident since 2018"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Quote *</label>
          <textarea
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={inputCls}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Display Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Avatar Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-background border border-border grid place-items-center flex-shrink-0">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl text-muted">{name.charAt(0) || "?"}</span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-dashed border-border rounded text-sm text-muted hover:border-amber-400 hover:text-amber-700 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : avatar ? "Change photo" : "+ Upload photo"}
            </button>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar("")}
                className="text-sm text-danger hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Visible on homepage</span>
        </label>
      </div>
    </div>
  );
}
