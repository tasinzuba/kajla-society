"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RichEditor } from "./RichEditor";
import { createPage, updatePage, type Page, type PageInput } from "@/lib/pages";

type Props = { initial?: Page };

const PROTECTED = new Set(["home", "about", "contact"]);

export function PageForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const isProtected = initial ? PROTECTED.has(initial.slug) : false;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleBn, setTitleBn] = useState(initial?.titleBn ?? "");
  const [content, setContent] = useState(
    initial?.content && initial.content !== "{}" ? initial.content : ""
  );
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(initial?.metaDesc ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    if (!content || content === "<p></p>") return setError("Content cannot be empty");

    setSubmitting(true);
    const input: PageInput = {
      title: title.trim(),
      titleBn: titleBn.trim() || null,
      content,
      metaTitle: metaTitle.trim() || null,
      metaDesc: metaDesc.trim() || null,
      isPublished,
      ...(isEdit ? {} : { slug: slug.trim() || undefined }),
    };

    try {
      if (isEdit) await updatePage(initial!.id, input);
      else await createPage(input);
      router.push("/admin/pages");
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
          <Link href="/admin/pages" className="text-sm text-muted hover:text-primary">
            ← Back to pages
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? `Edit: ${initial!.title}` : "New Page"}
          </h1>
          {initial && (
            <p className="text-xs text-muted mt-1">
              URL: <code>/{initial.slug}</code>
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
                URL Slug (auto from title if blank)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
                placeholder="e.g. privacy-policy"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-xl font-semibold border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
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
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Content <span className="text-danger">*</span>
            </label>
            <RichEditor value={content} onChange={setContent} />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              Visibility
            </h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                disabled={isProtected}
              />
              <span>Published</span>
            </label>
            {isProtected && (
              <p className="text-xs text-muted mt-2">
                System pages stay published.
              </p>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-primary uppercase mb-3">
              SEO (optional)
            </h3>
            <label className="block text-xs text-muted mb-1">Meta title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm mb-3"
              maxLength={200}
            />
            <label className="block text-xs text-muted mb-1">Meta description</label>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm"
              maxLength={500}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
