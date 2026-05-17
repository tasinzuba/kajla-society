"use client";

import { use, useEffect, useState } from "react";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { adminGetHeroSlide, type HeroSlide } from "@/lib/hero-slides";

export default function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetHeroSlide(id)
      .then(setSlide)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="px-4 py-8 text-danger">Failed to load: {error}</div>;
  if (!slide) return <div className="px-4 py-8 text-muted">Loading...</div>;

  return <HeroSlideForm initial={slide} />;
}
