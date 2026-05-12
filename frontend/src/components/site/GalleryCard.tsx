import Link from "next/link";
import { HiOutlinePhoto, HiOutlinePlayCircle } from "react-icons/hi2";
import { mediaUrl } from "@/lib/media";
import type { GallerySummary } from "@/lib/galleries";

export function GalleryCard({ g }: { g: GallerySummary }) {
  return (
    <Link
      href={`/media/${g.slug}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1 flex flex-col"
    >
      <div className="aspect-video bg-accent/30 relative overflow-hidden">
        {g.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(g.coverImage) ?? ""}
            alt={g.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-primary/30 text-6xl bg-gradient-to-br from-accent to-cream">
            {g.type === "VIDEO" ? <HiOutlinePlayCircle /> : <HiOutlinePhoto />}
          </div>
        )}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold shadow ${
            g.type === "VIDEO"
              ? "bg-primary text-white"
              : "bg-white text-primary"
          }`}
        >
          {g.type === "VIDEO" ? <HiOutlinePlayCircle /> : <HiOutlinePhoto />}
          {g.type === "VIDEO" ? "Video" : "Photos"}
        </span>
        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-semibold">
          {g._count.media} item{g._count.media === 1 ? "" : "s"}
        </span>

        {g.type === "VIDEO" && g.coverImage && (
          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <HiOutlinePlayCircle className="text-7xl text-white drop-shadow-2xl" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1">
        <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition tracking-tight">
          {g.title}
        </h3>
        {g.description && (
          <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
            {g.description}
          </p>
        )}
      </div>
    </Link>
  );
}
