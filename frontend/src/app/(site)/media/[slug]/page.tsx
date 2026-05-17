import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlinePhoto,
  HiOutlinePlayCircle,
} from "react-icons/hi2";
import { getGalleryBySlug } from "@/lib/galleries";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const g = await getGalleryBySlug(slug);
    return { title: g.title, description: g.description ?? undefined };
  } catch {
    return { title: "Gallery not found" };
  }
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let gallery;
  try {
    gallery = await getGalleryBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[300px] md:h-[380px] overflow-hidden">
        {gallery.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(gallery.coverImage) ?? ""}
            alt={gallery.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-mesh-blue" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary/70 to-primary/40" />

        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-12 text-white">
          <Link
            href={gallery.type === "VIDEO" ? "/media/videos" : "/media/photos"}
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-4 transition w-fit"
          >
            <HiOutlineArrowLeft />
            Back to {gallery.type === "VIDEO" ? "videos" : "photos"}
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold mb-3 w-fit ${
              gallery.type === "VIDEO"
                ? "bg-white text-primary"
                : "bg-white/20 backdrop-blur text-white border border-white/30"
            }`}
          >
            {gallery.type === "VIDEO" ? <HiOutlinePlayCircle /> : <HiOutlinePhoto />}
            {gallery.type === "VIDEO" ? "Video Album" : "Photo Album"}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="text-white/85 mt-3 max-w-2xl">
              {gallery.description}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {gallery.media.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <p className="text-muted">No media in this album yet.</p>
          </div>
        ) : gallery.type === "PHOTO" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.media.map((m) => (
              <a
                key={m.id}
                href={mediaUrl(m.url) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square bg-cream rounded-2xl overflow-hidden group relative shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(m.url) ?? ""}
                  alt={m.caption ?? gallery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {m.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3 font-medium">
                    {m.caption}
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {gallery.media.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="aspect-video bg-black">
                  <iframe
                    src={m.url}
                    title={m.caption ?? gallery.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {m.caption && (
                  <div className="p-4 text-sm text-foreground/85 font-medium">
                    {m.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
