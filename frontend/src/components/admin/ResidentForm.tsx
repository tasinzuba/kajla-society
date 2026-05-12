"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createResident,
  updateResident,
  type Resident,
  type ResidentInput,
} from "@/lib/residents";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = { initial?: Resident };

export function ResidentForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [fullNameBn, setFullNameBn] = useState(initial?.fullNameBn ?? "");
  const [houseNo, setHouseNo] = useState(initial?.houseNo ?? "");
  const [road, setRoad] = useState(initial?.road ?? "");
  const [block, setBlock] = useState(initial?.block ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [membershipNo, setMembershipNo] = useState(initial?.membershipNo ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [isVerified, setIsVerified] = useState(initial?.isVerified ?? false);
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  async function uploadPhoto(file: File) {
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
      setPhoto(body.data.url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit() {
    setError(null);
    if (!fullName.trim()) return setError("Full name is required");
    if (!houseNo.trim()) return setError("House number is required");
    setSubmitting(true);

    const input: ResidentInput = {
      fullName: fullName.trim(),
      fullNameBn: fullNameBn.trim() || null,
      houseNo: houseNo.trim(),
      road: road.trim() || null,
      block: block.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      membershipNo: membershipNo.trim() || null,
      photo: photo || null,
      isVerified,
      isPublic,
    };

    try {
      if (isEdit) await updateResident(initial!.id, input);
      else await createResident(input);
      router.push("/admin/residents");
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
          <Link href="/admin/residents" className="text-sm text-muted hover:text-primary">
            ← Back to residents
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Resident" : "New Resident"}
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
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-cream overflow-hidden flex-shrink-0">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(photo) ?? ""}
                alt="photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-2xl text-secondary/40">
                👤
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadPhoto(f);
                e.target.value = "";
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 border border-dashed border-border rounded text-sm hover:border-secondary disabled:opacity-50"
              >
                {uploading ? "Uploading..." : photo ? "Change photo" : "+ Upload photo"}
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="px-3 py-2 text-sm text-danger hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Name (বাংলা)
            </label>
            <input
              value={fullNameBn}
              onChange={(e) => setFullNameBn(e.target.value)}
              lang="bn"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              House No <span className="text-danger">*</span>
            </label>
            <input
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Road
            </label>
            <input
              value={road}
              onChange={(e) => setRoad(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Block
            </label>
            <input
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
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
            Membership No
          </label>
          <input
            value={membershipNo}
            onChange={(e) => setMembershipNo(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            placeholder="e.g. M0023"
          />
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
            />
            <span>Verified resident</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Show on public directory</span>
          </label>
          <p className="text-xs text-muted">
            Only verified + public residents are visible at /residence-directory.
            Contact info (phone/email) is always hidden from public — only admin can see.
          </p>
        </div>
      </div>
    </div>
  );
}
