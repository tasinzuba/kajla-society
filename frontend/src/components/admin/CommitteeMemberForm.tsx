"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createCommitteeMember,
  updateCommitteeMember,
  type CommitteeMember,
  type CommitteeInput,
} from "@/lib/committee";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = { initial?: CommitteeMember };

export function CommitteeMemberForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [nameBn, setNameBn] = useState(initial?.nameBn ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [roleBn, setRoleBn] = useState(initial?.roleBn ?? "");
  const [term, setTerm] = useState(initial?.term ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

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
    if (!name.trim()) return setError("Name is required");
    if (!role.trim()) return setError("Role is required");
    if (!term.trim()) return setError("Term is required");
    setSubmitting(true);

    const input: CommitteeInput = {
      name: name.trim(),
      nameBn: nameBn.trim() || null,
      role: role.trim(),
      roleBn: roleBn.trim() || null,
      term: term.trim(),
      order,
      bio: bio.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      photo: photo || null,
      isActive,
    };

    try {
      if (isEdit) await updateCommitteeMember(initial!.id, input);
      else await createCommitteeMember(input);
      router.push("/admin/committee");
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
          <Link href="/admin/committee" className="text-sm text-muted hover:text-primary">
            ← Back to members
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-1">
            {isEdit ? "Edit Member" : "New Member"}
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
        {/* Photo */}
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg bg-cream overflow-hidden flex-shrink-0">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(photo) ?? ""}
                alt="photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-3xl text-secondary/40">
                👤
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Photo
            </label>
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
                {uploading ? "Uploading..." : photo ? "Change" : "+ Upload photo"}
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

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Role <span className="text-danger">*</span>
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. President, General Secretary"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Role (বাংলা)
            </label>
            <input
              value={roleBn}
              onChange={(e) => setRoleBn(e.target.value)}
              lang="bn"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background font-bn"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
              Term <span className="text-danger">*</span>
            </label>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. 2024-2026"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background"
            />
          </div>
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
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Visible on public site</span>
        </label>
      </div>
    </div>
  );
}
