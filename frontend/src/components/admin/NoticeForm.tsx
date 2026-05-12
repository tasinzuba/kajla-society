"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RichEditor } from "./RichEditor";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";
import {
  createNotice,
  updateNotice,
  type NoticeDetail,
  type NoticeInput,
} from "@/lib/notices";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = {
  initial?: NoticeDetail;
};

export function NoticeForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleBn, setTitleBn] = useState(initial?.titleBn ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [attachment, setAttachment] = useState(initial?.attachment ?? "");
  const [isPinned, setIsPinned] = useState(initial?.isPinned ?? false);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadAttachment(file: File) {
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
      setAttachment(body.data.url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(publish: boolean) {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    if (!content || content === "<p></p>") return setError("Content is required");

    setSubmitting(true);
    const input: NoticeInput = {
      title: title.trim(),
      titleBn: titleBn.trim() || null,
      content,
      attachment: attachment || null,
      isPinned,
      isPublished: publish,
    };

    try {
      if (isEdit) await updateNotice(initial!.id, input);
      else await createNotice(input);
      router.push("/admin/notices");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  const filename = attachment ? attachment.split("/").pop() : "";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/notices" className="text-sm text-muted hover:text-primary">
            ← Back to notices
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Notice" : "New Notice"}
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
              placeholder="Notice title"
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
              Content <span className="text-danger">*</span>
            </label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="Notice body..."
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Visibility
            </h3>
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>Published</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>📌 Pin to top</span>
            </label>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Attachment (PDF / image)
            </h3>
            {attachment && (
              <div className="mb-3 p-2 border border-border rounded text-sm flex items-center justify-between gap-2 bg-cream">
                <a
                  href={mediaUrl(attachment) ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary truncate hover:underline"
                >
                  📎 {filename}
                </a>
                <button
                  type="button"
                  onClick={() => setAttachment("")}
                  className="text-danger text-xs px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAttachment(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-2 border border-dashed border-border rounded text-sm text-muted hover:border-secondary hover:text-secondary transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : attachment ? "Replace file" : "+ Upload file"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
