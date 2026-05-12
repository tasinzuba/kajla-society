"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminGetGallery,
  addMediaItem,
  removeMediaItem,
  updateGallery,
  type GalleryDetail,
} from "@/lib/galleries";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function ManageGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit details
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [description, setDescription] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  // Add media
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const g = await adminGetGallery(id);
      setGallery(g);
      setTitle(g.title);
      setTitleBn(g.titleBn ?? "");
      setDescription(g.description ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveMeta() {
    if (!gallery) return;
    setSavingMeta(true);
    try {
      await updateGallery(id, {
        title: title.trim(),
        titleBn: titleBn.trim() || null,
        description: description.trim() || null,
        type: gallery.type,
        coverImage: gallery.coverImage,
      });
      setEditing(false);
      load();
    } catch (e) {
      alert(`Save failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setSavingMeta(false);
    }
  }

  async function onUploadPhoto(file: File) {
    setAddError(null);
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
      await addMediaItem(id, { url: body.data.url, caption: caption || null });
      setCaption("");
      load();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onAddVideo() {
    if (!videoUrl.trim()) return;
    setAddError(null);
    setAddingVideo(true);
    try {
      await addMediaItem(id, { url: videoUrl.trim(), caption: caption || null });
      setVideoUrl("");
      setCaption("");
      load();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Add failed");
    } finally {
      setAddingVideo(false);
    }
  }

  async function onRemoveMedia(mediaId: string) {
    if (!confirm("Remove this item?")) return;
    try {
      await removeMediaItem(id, mediaId);
      load();
    } catch (e) {
      alert(`Remove failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  if (error) return <div className="text-danger">Failed: {error}</div>;
  if (!gallery) return <div className="text-muted">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link href="/admin/gallery" className="text-sm text-muted hover:text-primary">
          ← Back to galleries
        </Link>
      </div>

      {/* Details */}
      <div className="bg-surface border border-border rounded-lg p-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-xl font-semibold"
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
            <div className="flex gap-2">
              <button
                onClick={saveMeta}
                disabled={savingMeta}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {savingMeta ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <span
                className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold mb-2 ${
                  gallery.type === "VIDEO"
                    ? "bg-primary text-white"
                    : "bg-secondary text-white"
                }`}
              >
                {gallery.type === "VIDEO" ? "▶ Video Album" : "🖼 Photo Album"}
              </span>
              <h1 className="text-3xl font-bold text-primary">{gallery.title}</h1>
              {gallery.titleBn && (
                <p className="text-muted font-bn mt-1" lang="bn">
                  {gallery.titleBn}
                </p>
              )}
              {gallery.description && (
                <p className="text-sm text-muted mt-2">{gallery.description}</p>
              )}
              <div className="text-xs text-muted mt-2">/{gallery.slug}</div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/media/${gallery.slug}`}
                target="_blank"
                className="px-3 py-1.5 border border-border rounded text-sm hover:bg-cream"
              >
                View public
              </Link>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 border border-border rounded text-sm hover:bg-cream"
              >
                Edit details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add media */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-semibold text-primary mb-3">
          Add {gallery.type === "PHOTO" ? "Photo" : "Video"}
        </h2>
        {addError && (
          <div className="px-3 py-2 mb-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
            {addError}
          </div>
        )}
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full px-4 py-2 mb-3 border border-border rounded-lg bg-background text-sm"
        />
        {gallery.type === "PHOTO" ? (
          <>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadPhoto(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-light transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "+ Upload photo"}
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-sm"
            />
            <button
              onClick={onAddVideo}
              disabled={addingVideo || !videoUrl.trim()}
              className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold disabled:opacity-50"
            >
              {addingVideo ? "Adding..." : "Add"}
            </button>
          </div>
        )}
      </div>

      {/* Media list */}
      <div>
        <h2 className="font-semibold text-primary mb-3">
          Media ({gallery.media.length})
        </h2>
        {gallery.media.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center text-muted">
            No media added yet.
          </div>
        ) : gallery.type === "PHOTO" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.media.map((m) => (
              <div
                key={m.id}
                className="relative aspect-square bg-cream rounded-lg overflow-hidden group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(m.url) ?? ""}
                  alt={m.caption ?? ""}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveMedia(m.id)}
                  className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
                {m.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                    {m.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.media.map((m) => (
              <div
                key={m.id}
                className="bg-surface border border-border rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-black relative">
                  <iframe src={m.url} className="w-full h-full" allowFullScreen />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm truncate">{m.caption ?? "(no caption)"}</span>
                  <button
                    onClick={() => onRemoveMedia(m.id)}
                    className="text-xs text-danger hover:underline ml-2 whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
