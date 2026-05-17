import Link from "next/link";
import { HiOutlinePlayCircle } from "react-icons/hi2";
import { listGalleriesPublic, type GallerySummary } from "@/lib/galleries";
import { GalleryCard } from "@/components/site/GalleryCard";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Video Gallery" };
export const dynamic = "force-dynamic";

export default async function VideosPage() {
  let galleries: GallerySummary[] = [];
  try {
    galleries = await listGalleriesPublic("VIDEO");
  } catch {
    galleries = [];
  }

  return (
    <>
      <PageHero
        title="Video Gallery"
        titleBn="ভিডিও গ্যালারি"
        subtitle="Video recordings from Kajla Society events."
        image={stockImages.heroMedia}
        crumbs={[{ label: "Media", href: "/media" }, { label: "Videos" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-2 mb-10 p-1 bg-white border border-border rounded-xl w-fit shadow-sm">
          <Link
            href="/media"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-muted hover:text-primary transition"
          >
            All
          </Link>
          <Link
            href="/media/photos"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-muted hover:text-primary transition"
          >
            Photos
          </Link>
          <span className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-400 text-primary-dark shadow">
            Videos ({galleries.length})
          </span>
        </div>

        {galleries.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlinePlayCircle className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No videos yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((g) => (
              <GalleryCard key={g.id} g={g} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
