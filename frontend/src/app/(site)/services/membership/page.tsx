"use client";

import { useState } from "react";
import { submitMembership } from "@/lib/applications";
import { ApplicationLayout } from "@/components/site/ApplicationLayout";
import { ApplicationSuccess, Field, inputCls } from "@/components/site/ApplicationSuccess";

export default function MembershipPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseNo: "",
    road: "",
    block: "",
    nidNumber: "",
    occupation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitMembership({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        houseNo: form.houseNo,
        road: form.road || null,
        block: form.block || null,
        nidNumber: form.nidNumber || null,
        occupation: form.occupation || null,
      });
      setSubmittedId(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ApplicationLayout
      title="Membership Registration"
      subtitle="Apply to become a member of Kajla Society."
      current="/services/membership"
    >
      {submittedId ? (
        <ApplicationSuccess id={submittedId} type="membership" />
      ) : (
        <form
          onSubmit={onSubmit}
          className="bg-white border border-border rounded-2xl p-7 space-y-5 shadow-md"
        >
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Field label="Full Name" required>
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Phone" required>
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputCls}
                placeholder="01XXXXXXXXX"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="House No" required>
              <input
                required
                value={form.houseNo}
                onChange={(e) => update("houseNo", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Road">
              <input
                value={form.road}
                onChange={(e) => update("road", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Block">
              <input
                value={form.block}
                onChange={(e) => update("block", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="NID Number">
              <input
                value={form.nidNumber}
                onChange={(e) => update("nidNumber", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Occupation">
              <input
                value={form.occupation}
                onChange={(e) => update("occupation", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-xs text-muted text-center">
            Our committee will review your application and email you within 7 business days.
          </p>
        </form>
      )}
    </ApplicationLayout>
  );
}

