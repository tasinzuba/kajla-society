"use client";

import { useState } from "react";
import { submitCarSticker } from "@/lib/applications";
import { ApplicationLayout } from "@/components/site/ApplicationLayout";
import { ApplicationSuccess, Field, inputCls } from "@/components/site/ApplicationSuccess";

const VEHICLE_TYPES = ["Car", "Motorcycle", "SUV", "Pickup", "Other"];

export default function CarStickerPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseNo: "",
    vehicleType: "Car",
    brandModel: "",
    registrationNo: "",
    color: "",
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
      const result = await submitCarSticker({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        houseNo: form.houseNo,
        vehicleType: form.vehicleType,
        brandModel: form.brandModel,
        registrationNo: form.registrationNo,
        color: form.color || null,
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
      title="Car Sticker Application"
      subtitle="Apply for a Kajla Society vehicle access sticker."
      current="/services/car-sticker"
    >
      {submittedId ? (
        <ApplicationSuccess id={submittedId} type="car sticker" />
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

          <h3 className="text-xs uppercase tracking-wider text-muted font-semibold border-b border-border pb-2">
            Applicant Details
          </h3>

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
              />
            </Field>
          </div>

          <Field label="House No (Resident address)" required>
            <input
              required
              value={form.houseNo}
              onChange={(e) => update("houseNo", e.target.value)}
              className={inputCls}
            />
          </Field>

          <h3 className="text-xs uppercase tracking-wider text-muted font-semibold border-b border-border pb-2 pt-4">
            Vehicle Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Vehicle Type" required>
              <select
                required
                value={form.vehicleType}
                onChange={(e) => update("vehicleType", e.target.value)}
                className={inputCls}
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Color">
              <input
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
                className={inputCls}
                placeholder="e.g. White"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand & Model" required>
              <input
                required
                value={form.brandModel}
                onChange={(e) => update("brandModel", e.target.value)}
                className={inputCls}
                placeholder="e.g. Toyota Corolla"
              />
            </Field>
            <Field label="Registration No" required>
              <input
                required
                value={form.registrationNo}
                onChange={(e) => update("registrationNo", e.target.value)}
                className={inputCls}
                placeholder="DHK-METRO-XX-00-0000"
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
        </form>
      )}
    </ApplicationLayout>
  );
}
