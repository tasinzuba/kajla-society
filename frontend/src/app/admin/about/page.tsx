"use client";

import { useEffect, useState } from "react";
import {
  getSetting,
  updateSetting,
  parseAboutContent,
  ABOUT_SETTING_KEY,
  ABOUT_DEFAULTS,
  type AboutContent,
} from "@/lib/settings";

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm";
const labelCls = "block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider";

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutContent>(ABOUT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSetting(ABOUT_SETTING_KEY)
      .then((raw) => setContent(parseAboutContent(raw)))
      .catch(() => setContent(ABOUT_DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function setFocus(i: number, key: "title" | "desc", value: string) {
    setContent((c) => ({
      ...c,
      focusAreas: c.focusAreas.map((f, idx) =>
        idx === i ? { ...f, [key]: value } : f
      ),
    }));
    setSaved(false);
  }

  function addFocus() {
    setContent((c) => ({
      ...c,
      focusAreas: [...c.focusAreas, { title: "", desc: "" }],
    }));
  }

  function removeFocus(i: number) {
    setContent((c) => ({
      ...c,
      focusAreas: c.focusAreas.filter((_, idx) => idx !== i),
    }));
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const clean = {
        ...content,
        focusAreas: content.focusAreas.filter((f) => f.title.trim()),
      };
      await updateSetting(ABOUT_SETTING_KEY, JSON.stringify(clean));
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-md p-16 text-center text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">About Page</h1>
          <p className="text-sm text-muted mt-1">
            Edit the text shown on the public About page. The design stays the
            same — only the words change.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 font-semibold">✓ Saved</span>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-amber-400 text-primary-dark rounded-lg hover:bg-amber-300 transition text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Hero + intro */}
      <section className="bg-surface border border-border rounded-lg p-6 space-y-5">
        <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wider pb-3 border-b border-border">
          Intro
        </h2>
        <div>
          <label className={labelCls}>Hero Subtitle</label>
          <input
            value={content.heroSubtitle}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Intro Heading</label>
          <input
            value={content.introHeading}
            onChange={(e) => set("introHeading", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Intro Paragraph 1</label>
          <textarea
            rows={3}
            value={content.introText1}
            onChange={(e) => set("introText1", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Intro Paragraph 2</label>
          <textarea
            rows={2}
            value={content.introText2}
            onChange={(e) => set("introText2", e.target.value)}
            className={inputCls}
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface border border-border rounded-lg p-6 space-y-5">
        <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wider pb-3 border-b border-border">
          Mission & Vision
        </h2>
        <div>
          <label className={labelCls}>Mission</label>
          <textarea
            rows={3}
            value={content.mission}
            onChange={(e) => set("mission", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Vision</label>
          <textarea
            rows={3}
            value={content.vision}
            onChange={(e) => set("vision", e.target.value)}
            className={inputCls}
          />
        </div>
      </section>

      {/* Focus areas */}
      <section className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wider">
            Focus Areas
          </h2>
          <button
            onClick={addFocus}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider"
          >
            + Add area
          </button>
        </div>
        {content.focusAreas.map((f, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Area {i + 1}
              </span>
              <button
                onClick={() => removeFocus(i)}
                className="text-xs text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <input
              value={f.title}
              onChange={(e) => setFocus(i, "title", e.target.value)}
              placeholder="Title"
              className={inputCls}
            />
            <textarea
              rows={2}
              value={f.desc}
              onChange={(e) => setFocus(i, "desc", e.target.value)}
              placeholder="Description"
              className={inputCls}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
