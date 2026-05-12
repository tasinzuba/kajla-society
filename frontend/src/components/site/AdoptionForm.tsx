"use client";

import { useState } from "react";
import { submitAdoption, type AdoptionTarget } from "@/lib/applications";
import { ApplicationSuccess, Field, inputCls } from "./ApplicationSuccess";

type Props = {
  target: AdoptionTarget;
  locationLabel: string;
  locationPlaceholder: string;
};

export function AdoptionForm({ target, locationLabel, locationPlaceholder }: Props) {
  const [form, setForm] = useState({
    applicantName: "",
    email: "",
    phone: "",
    organization: "",
    locationRef: "",
    message: "",
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
      const result = await submitAdoption({
        target,
        applicantName: form.applicantName,
        email: form.email,
        phone: form.phone,
        organization: form.organization || null,
        locationRef: form.locationRef,
        message: form.message || null,
      });
      setSubmittedId(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <ApplicationSuccess
        id={submittedId}
        type={`${target.toLowerCase()} adoption`}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-border rounded-2xl p-7 space-y-5 shadow-md"
    >
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Field label="Applicant / Organization Name" required>
        <input
          required
          value={form.applicantName}
          onChange={(e) => update("applicantName", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Organization (if applicable)">
        <input
          value={form.organization}
          onChange={(e) => update("organization", e.target.value)}
          className={inputCls}
          placeholder="Company / business name"
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
          />
        </Field>
      </div>

      <Field label={locationLabel} required>
        <input
          required
          value={form.locationRef}
          onChange={(e) => update("locationRef", e.target.value)}
          className={inputCls}
          placeholder={locationPlaceholder}
        />
      </Field>

      <Field label="Message / Proposal">
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputCls}
          placeholder="Tell us about your interest, maintenance commitment, branding ideas, etc."
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
