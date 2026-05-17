"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiOutlinePhoto,
  HiOutlinePlayCircle,
  HiOutlineEye,
  HiOutlineCalendarDays,
  HiArrowRight,
} from "react-icons/hi2";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";
import type { GallerySummary } from "@/lib/galleries";

type Props = {
  photos: GallerySummary[];
  videos: GallerySummary[];
};

export function HomeGallery({ photos, videos }: Props) {
  const [tab, setTab] = useState<"PHOTO" | "VIDEO">("PHOTO");

  const items = tab === "PHOTO" ? photos : videos;

  return (
    <section className="py-24 bg-gradient-to-b from-primary-dark via-[#0c1a3d] to-primary-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-[0.07]" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-emerald/10 blur-3xl" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-primary-light/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-pale text-emerald-dark rounded-full text-[10px] uppercase tracking-widest font-bold mb-5">
            <HiOutlinePhoto />
            Community Media
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Community Gallery
          </h2>
          <p className="text-white/70 text-lg">
            Explore our community through photos and videos.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-1 p-1.5 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <button
              onClick={() => setTab("PHOTO")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                tab === "PHOTO"
                  ? "bg-amber-400 text-primary-dark shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <HiOutlinePhoto className="text-lg" />
              Photos
              <span className="text-xs opacity-75">({photos.length})</span>
            </button>
            <button
              onClick={() => setTab("VIDEO")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                tab === "VIDEO"
                  ? "bg-amber-400 text-primary-dark shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <HiOutlinePlayCircle className="text-lg" />
              Videos
              <span className="text-xs opacity-75">({videos.length})</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl py-16 text-center">
            {tab === "PHOTO" ? (
              <HiOutlinePhoto className="text-5xl text-white/30 mx-auto mb-4" />
            ) : (
              <HiOutlinePlayCircle className="text-5xl text-white/30 mx-auto mb-4" />
            )}
            <p className="text-white/60">
              No {tab === "PHOTO" ? "photo" : "video"} galleries yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 6).map((g) => {
              const cover = mediaUrl(g.coverImage);
              return (
                <Link
                  key={g.id}
                  href={`/media/${g.slug}`}
                  className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-emerald/40 hover:bg-white/[0.07] transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={g.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-white/30 text-6xl">
                        {g.type === "VIDEO" ? <HiOutlinePlayCircle /> : <HiOutlinePhoto />}
                      </div>
                    )}

                    {/* Top-left type badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur text-primary-dark rounded-md text-[10px] uppercase tracking-wider font-bold shadow">
                      {g.type === "VIDEO" ? <HiOutlinePlayCircle /> : <HiOutlinePhoto />}
                      {g.type === "VIDEO" ? "Video" : "Photos"}
                    </span>

                    {/* Bottom-right item count */}
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      <HiOutlineEye />
                      {g._count.media}
                    </span>

                    {/* Video play overlay */}
                    {g.type === "VIDEO" && cover && (
                      <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiOutlinePlayCircle className="text-7xl text-white drop-shadow-2xl" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base lg:text-lg text-white tracking-tight group-hover:text-emerald-light transition leading-snug line-clamp-2">
                      {g.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/60 mt-2">
                      <HiOutlineCalendarDays />
                      {formatDate(g.createdAt)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View all CTA */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href={tab === "PHOTO" ? "/media/photos" : "/media/videos"}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-lg transition-all hover:-translate-y-0.5 uppercase tracking-wider text-sm"
            >
              View All {tab === "PHOTO" ? "Photos" : "Videos"}
              <HiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
