"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RichEditor } from "./RichEditor";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";
import {
  createArticle,
  updateArticle,
  listCategories,
  type Article,
  type ArticleInput,
  type Category,
} from "@/lib/articles";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = {
  initial?: Article;
};

export function ArticleForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleBn, setTitleBn] = useState(initial?.titleBn ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [contentBn, setContentBn] = useState(initial?.contentBn ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);

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
      alert(`Cover upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploadingCover(false);
    }
  }

  async function onSubmit(publish: boolean) {
    setSubmitting(true);
    setError(null);

    const input: ArticleInput = {
      title: title.trim(),
      titleBn: titleBn.trim() || null,
      excerpt: excerpt.trim() || null,
      content,
      contentBn: contentBn.trim() || null,
      coverImage: coverImage || null,
      categoryId: categoryId || null,
      isPublished: publish,
    };

    if (!input.title) {
      setError("Title is required");
      setSubmitting(false);
      return;
    }
    if (!input.content || input.content === "<p></p>") {
      setError("Content cannot be empty");
      setSubmitting(false);
      return;
    }

    try {
      const saved = isEdit
        ? await updateArticle(initial!.id, input)
        : await createArticle(input);
      router.push("/admin/articles");
      router.refresh();
      void saved;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/admin/articles"
            className="text-sm text-muted hover:text-primary"
          >
            ← Back to articles
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Article" : "New Article"}
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
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-xl font-semibold border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
              placeholder="Article title"
            />
          </div>

          {/* Title BN */}
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

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
              placeholder="Short summary shown in list views"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Content <span className="text-danger">*</span>
            </label>
            <RichEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Status */}
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
              <span>Publish immediately</span>
            </label>
            <p className="text-xs text-muted mt-2">
              {isPublished
                ? "Will be visible on the public site"
                : "Saved as draft"}
            </p>
          </div>

          {/* Category */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Category
            </h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm"
            >
              <option value="">(none)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover image */}
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

          {isEdit && initial && (
            <div className="bg-surface border border-border rounded-lg p-4 text-xs text-muted space-y-1">
              <div>Slug: <code>/{initial.slug}</code></div>
              <div>Views: {initial.viewCount}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
