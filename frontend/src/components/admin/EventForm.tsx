"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RichEditor } from "./RichEditor";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";
import {
  createEvent,
  updateEvent,
  type EventDetail,
  type EventInput,
} from "@/lib/events";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = {
  initial?: EventDetail;
};

// Convert an ISO date string to a value suitable for `<input type="datetime-local">`
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export function EventForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleBn, setTitleBn] = useState(initial?.titleBn ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startsAt, setStartsAt] = useState(toLocalInput(initial?.startsAt));
  const [endsAt, setEndsAt] = useState(toLocalInput(initial?.endsAt));
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function uploadCover(file: File) {
    setUploadingCover(true);
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
      setCoverImage(body.data.url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploadingCover(false);
    }
  }

  async function onSubmit(publish: boolean) {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    if (!description || description === "<p></p>") return setError("Description is required");
    if (!startsAt) return setError("Start date is required");

    setSubmitting(true);
    const input: EventInput = {
      title: title.trim(),
      titleBn: titleBn.trim() || null,
      description,
      location: location.trim() || null,
      coverImage: coverImage || null,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      isPublished: publish,
    };

    try {
      if (isEdit) await updateEvent(initial!.id, input);
      else await createEvent(input);
      router.push("/admin/events");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/events" className="text-sm text-muted hover:text-primary">
            ← Back to events
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Event" : "New Event"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(false)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-cream transition text-sm font-semibold disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? "Saving..." : isPublished ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-xl font-semibold border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title (বাংলা)
            </label>
            <input
              type="text"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              lang="bn"
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary font-bn"
              placeholder="বাংলা শিরোনাম (optional)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Description <span className="text-danger">*</span>
            </label>
            <RichEditor
              value={description}
              onChange={setDescription}
              placeholder="Describe the event..."
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Date & Time
            </h3>
            <label className="block text-xs text-muted mb-1">Starts at *</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm mb-3"
            />
            <label className="block text-xs text-muted mb-1">Ends at (optional)</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm"
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Location
            </h3>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm"
              placeholder="e.g. Community Hall"
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Status
            </h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>Published</span>
            </label>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Cover Image
            </h3>
            {coverImage && (
              <div className="mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(coverImage) ?? ""}
                  alt="cover"
                  className="w-full rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadCover(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="w-full py-2 border border-dashed border-border rounded text-sm text-muted hover:border-secondary hover:text-secondary transition disabled:opacity-50"
            >
              {uploadingCover ? "Uploading..." : coverImage ? "Change image" : "+ Upload image"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
