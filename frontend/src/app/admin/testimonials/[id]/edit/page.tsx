"use client";

import { useEffect, useState, use } from "react";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { adminGetTestimonial, type Testimonial } from "@/lib/testimonials";

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<Testimonial | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetTestimonial(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, [id]);

  if (error) {
    return (
      <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-white border border-border rounded-md p-16 text-center text-muted">
        Loading...
      </div>
    );
  }

  return <TestimonialForm initial={item} />;
}
