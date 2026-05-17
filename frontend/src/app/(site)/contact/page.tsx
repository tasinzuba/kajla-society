"use client";

import { useState } from "react";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiArrowRight,
} from "react-icons/hi2";
import { submitContact } from "@/lib/contact";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";

  return (
    <>
      <PageHero
        title="Contact Us"
        titleBn="যোগাযোগ"
        subtitle="Reach out to Kajla Society — we'd love to hear from you."
        image={stockImages.heroContact}
        crumbs={[{ label: "Contact" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-4">
            {[
              {
                Icon: HiOutlineMapPin,
                label: "Office Address",
                value: "Kajla, Dhaka, Bangladesh",
              },
              {
                Icon: HiOutlinePhone,
                label: "Phone",
                value: "+880 1XXX-XXXXXX",
                href: "tel:+8801XXXXXXXXX",
              },
              {
                Icon: HiOutlineEnvelope,
                label: "Email",
                value: "info@kajla.org",
                href: "mailto:info@kajla.org",
              },
              {
                Icon: HiOutlineClock,
                label: "Office Hours",
                value: "9:00 AM – 5:00 PM (Sun – Thu)",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent text-primary grid place-items-center flex-shrink-0">
                  <c.Icon className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">
                    {c.label}
                  </div>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="font-semibold text-primary hover:text-secondary truncate block"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-primary">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-md">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 grid place-items-center">
                  <HiOutlineCheckCircle className="text-5xl text-green-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-primary mb-2 tracking-tight">
                  Message sent!
                </h2>
                <p className="text-muted max-w-md mx-auto">
                  Thank you for reaching out. We&apos;ll respond as soon as
                  possible.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="bg-white border border-border rounded-2xl p-7 shadow-md space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-primary tracking-tight">
                    Send us a message
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    We typically respond within 1–2 business days.
                  </p>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputCls}
                    placeholder="Your name *"
                  />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputCls}
                    placeholder="Email *"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputCls}
                    placeholder="Phone (optional)"
                  />
                  <input
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className={inputCls}
                    placeholder="Subject"
                  />
                </div>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={inputCls}
                  placeholder="Your message... *"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 uppercase tracking-wider text-sm"
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <HiArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
