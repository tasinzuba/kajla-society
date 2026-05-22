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
  type FacilityCommitteeMember,
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
  const [donationPhone, setDonationPhone] = useState(initial?.donationPhone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [committee, setCommittee] = useState<FacilityCommitteeMember[]>(
    initial?.committee ?? []
  );
  const [eventPhotos, setEventPhotos] = useState<string[]>(
    initial?.eventPhotos ?? []
  );
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const eventInputRef = useRef<HTMLInputElement>(null);

  // Generic upload — returns the URL
  async function uploadFile(file: File): Promise<string | null> {
    const form = new FormData();
    form.append("file", file);
    const token = getToken();
    const res = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      alert(`Upload failed: ${body.message ?? "unknown"}`);
      return null;
    }
    return body.data.url as string;
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setImage(url);
    setUploading(false);
  }

  // Committee helpers
  function addMember() {
    setCommittee((c) => [...c, { name: "", title: "", phone: "", photo: "" }]);
  }
  function removeMember(i: number) {
    setCommittee((c) => c.filter((_, idx) => idx !== i));
  }
  function updateMember(
    i: number,
    key: keyof FacilityCommitteeMember,
    value: string
  ) {
    setCommittee((c) =>
      c.map((m, idx) => (idx === i ? { ...m, [key]: value } : m))
    );
  }
  async function uploadMemberPhoto(i: number, file: File) {
    setBusy(`member-${i}`);
    const url = await uploadFile(file);
    if (url) updateMember(i, "photo", url);
    setBusy(null);
  }

  // Event photo helpers
  async function uploadEventPhoto(file: File) {
    setBusy("event");
    const url = await uploadFile(file);
    if (url) setEventPhotos((p) => [...p, url]);
    setBusy(null);
  }
  function removeEventPhoto(i: number) {
    setEventPhotos((p) => p.filter((_, idx) => idx !== i));
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
      donationPhone: donationPhone.trim() || null,
      email: email.trim() || null,
      website: website.trim() || null,
      image: image || null,
      committee: committee
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name.trim(),
          title: m.title?.trim() || null,
          phone: m.phone?.trim() || null,
          photo: m.photo || null,
        })),
      eventPhotos,
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

        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
          <label className="block text-xs font-bold text-amber-800 mb-1.5 uppercase tracking-wider">
            Donation Phone (bKash / Nagad / Cash)
          </label>
          <input
            value={donationPhone}
            onChange={(e) => setDonationPhone(e.target.value)}
            placeholder="e.g. 01XXX-XXXXXX"
            className="w-full px-4 py-2 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
          <p className="text-[11px] text-amber-800/80 mt-2">
            Shown as a prominent &ldquo;Donate&rdquo; button on this
            institution&apos;s detail page. Leave blank to hide it.
          </p>
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
            Image <span className="text-danger">*</span>
            <span className="ml-2 text-[10px] font-normal text-muted normal-case tracking-normal">
              Every facility should have a photo for the public site
            </span>
          </label>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(image) ?? ""}
              alt={name}
              className="w-full max-w-md aspect-video object-cover rounded-lg border border-border mb-3 shadow-sm"
            />
          ) : (
            <div className="w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-border bg-background grid place-items-center text-center mb-3">
              <div>
                <div className="text-4xl mb-2 opacity-50">🏢</div>
                <div className="text-sm text-muted">No image uploaded</div>
                <div className="text-[11px] text-muted/80">Recommended: 1200×800px</div>
              </div>
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition disabled:opacity-50"
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

        {/* Committee members */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
              Committee Members
            </label>
            <button
              type="button"
              onClick={addMember}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider"
            >
              + Add member
            </button>
          </div>
          {committee.length === 0 ? (
            <p className="text-sm text-muted">No committee members added.</p>
          ) : (
            <div className="space-y-3">
              {committee.map((m, i) => {
                const photo = m.photo ? mediaUrl(m.photo) : null;
                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-start gap-3 p-3 rounded-lg border border-border bg-background"
                  >
                    {/* Photo */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-border grid place-items-center">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg text-muted">{m.name.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <label className="text-[10px] text-amber-700 font-bold cursor-pointer hover:underline">
                        {busy === `member-${i}` ? "..." : "Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadMemberPhoto(i, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    {/* Fields */}
                    <div className="flex-1 min-w-[200px] grid sm:grid-cols-3 gap-2">
                      <input
                        value={m.name}
                        onChange={(e) => updateMember(i, "name", e.target.value)}
                        placeholder="Name"
                        className="px-3 py-2 border border-border rounded bg-white text-sm"
                      />
                      <input
                        value={m.title ?? ""}
                        onChange={(e) => updateMember(i, "title", e.target.value)}
                        placeholder="Title (e.g. President)"
                        className="px-3 py-2 border border-border rounded bg-white text-sm"
                      />
                      <input
                        value={m.phone ?? ""}
                        onChange={(e) => updateMember(i, "phone", e.target.value)}
                        placeholder="Phone"
                        className="px-3 py-2 border border-border rounded bg-white text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(i)}
                      className="text-xs text-danger hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Event photos */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
              Event Photos
            </label>
            <button
              type="button"
              onClick={() => eventInputRef.current?.click()}
              disabled={busy === "event"}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider disabled:opacity-50"
            >
              {busy === "event" ? "Uploading..." : "+ Add photo"}
            </button>
            <input
              ref={eventInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadEventPhoto(f);
                e.target.value = "";
              }}
            />
          </div>
          {eventPhotos.length === 0 ? (
            <p className="text-sm text-muted">No event photos uploaded.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {eventPhotos.map((p, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(p) ?? ""}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeEventPhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-danger text-white text-xs grid place-items-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
