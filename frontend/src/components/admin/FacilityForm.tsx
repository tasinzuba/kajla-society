"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createFacility,
  updateFacility,
  CATEGORY_META,
  ALL_CATEGORIES,
  type Facility,
  type FacilityInput,
  type FacilityCategory,
} from "@/lib/facilities";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = { initial?: Facility };

export function FacilityForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [category, setCategory] = useState<FacilityCategory>(
    initial?.category ?? "RELIGIOUS"
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [nameBn, setNameBn] = useState(initial?.nameBn ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
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
    if (!name.trim()) return setError("Name is required");
    setSubmitting(true);

    const input: FacilityInput = {
      category,
      name: name.trim(),
      nameBn: nameBn.trim() || null,
      description: description.trim() || null,
      address: address.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      website: website.trim() || null,
      image: image || null,
      order,
      isActive,
    };

    try {
      if (isEdit) await updateFacility(initial!.id, input);
      else await createFacility(input);
      router.push("/admin/facilities");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/facilities" className="text-sm text-muted hover:text-primary">
            ← Back to facilities
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Facility" : "New Facility"}
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

      <div className="bg-surface border border-border rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Category <span className="text-danger">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FacilityCategory)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Name <span className="text-danger">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Name (বাংলা)
            </label>
            <input
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              lang="bn"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
            />
          </div>
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

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Website
          </label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
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
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Visible on public site</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Image
          </label>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(image) ?? ""}
              alt={name}
              className="w-32 h-32 object-cover rounded-lg border border-border mb-3"
            />
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 border border-dashed border-border rounded text-sm text-muted hover:border-secondary hover:text-secondary transition disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
