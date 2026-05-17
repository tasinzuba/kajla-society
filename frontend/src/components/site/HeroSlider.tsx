"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import type { HeroSlide } from "@/lib/hero-slides";
import { mediaUrl } from "@/lib/media";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = slides.length;

  const goTo = useCallback(
    (i: number) => {
      if (total === 0) return;
      setIndex(((i % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Autoplay
  useEffect(() => {
    if (total <= 1 || paused) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, total]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (total === 0) {
    return (
      <section className="relative h-screen w-full bg-gradient-to-br from-primary-dark via-primary to-emerald-dark grid place-items-center text-white">
        <div className="text-center px-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to Kajla Society
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Add slides from the admin panel to customize this hero.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const src = mediaUrl(s.image);
        const active = i === index;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!active}
          >
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={s.title ?? ""}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {(s.title || s.subtitle || s.ctaLabel) && (
              <div className="relative h-full flex items-end lg:items-center">
                <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 pb-24 lg:pb-0">
                  <div
                    className={`max-w-3xl text-white transition-all duration-1000 ${
                      active
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    {s.title && (
                      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-4 drop-shadow-2xl">
                        {s.title}
                      </h1>
                    )}
                    {s.titleBn && (
                      <h2
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4 text-emerald-light font-bn"
                        lang="bn"
                      >
                        {s.titleBn}
                      </h2>
                    )}
                    {s.subtitle && (
                      <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mb-3">
                        {s.subtitle}
                      </p>
                    )}
                    {s.subtitleBn && (
                      <p
                        className="text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mb-3 font-bn"
                        lang="bn"
                      >
                        {s.subtitleBn}
                      </p>
                    )}
                    {s.ctaLabel && s.ctaHref && (
                      <Link
                        href={s.ctaHref}
                        className="group inline-flex items-center gap-2 mt-6 px-7 py-4 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-xl hover:-translate-y-0.5 transition-all uppercase tracking-wide text-sm"
                      >
                        {s.ctaLabel}
                        <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white grid place-items-center transition-colors ring-1 ring-white/20"
          >
            <HiChevronLeft className="text-2xl lg:text-3xl" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white grid place-items-center transition-colors ring-1 ring-white/20"
          >
            <HiChevronRight className="text-2xl lg:text-3xl" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-10 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {total > 1 && (
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20 text-white/80 text-xs font-bold uppercase tracking-widest bg-black/30 backdrop-blur px-3 py-1.5 rounded-full">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      )}
    </section>
  );
}
