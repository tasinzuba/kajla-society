"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGallery, type MediaType } from "@/lib/galleries";

export default function NewGalleryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MediaType>("PHOTO");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    setSubmitting(true);
    try {
      const created = await createGallery({
        title: title.trim(),
        titleBn: titleBn.trim() || null,
        description: description.trim() || null,
        type,
      });
      router.push(`/admin/gallery/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/gallery" className="text-sm text-muted hover:text-primary">
          ← Back to galleries
        </Link>
        <h1 className="text-3xl font-bold text-primary mt-1">New Album</h1>
        <p className="text-muted text-sm mt-1">
          Create an album, then add photos or videos on the next screen.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Album Type <span className="text-danger">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["PHOTO", "VIDEO"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  type === t
                    ? "border-primary bg-accent/20"
                    : "border-border hover:border-secondary"
                }`}
              >
                <div className="text-2xl mb-1">{t === "PHOTO" ? "🖼" : "▶"}</div>
                <div className="font-semibold text-primary">
                  {t === "PHOTO" ? "Photo Album" : "Video Album"}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {t === "PHOTO"
                    ? "Upload images"
                    : "Embed YouTube videos"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Title <span className="text-danger">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            placeholder="e.g. Eid 2025 Celebration"
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
            className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Album"}
        </button>
      </div>
    </div>
  );
}
