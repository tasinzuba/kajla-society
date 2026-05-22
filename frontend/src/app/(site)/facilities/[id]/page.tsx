import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineArrowLeft,
  HiOutlineUserGroup,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { getFacilityPublic, CATEGORY_META } from "@/lib/facilities";
import { mediaUrl } from "@/lib/media";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const f = await getFacilityPublic(id);
    return { title: f.name };
  } catch {
    return { title: "Facility" };
  }
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let f;
  try {
    f = await getFacilityPublic(id);
  } catch {
    notFound();
  }

  const cover = mediaUrl(f.image);
  const meta = CATEGORY_META[f.category];
  const committee = Array.isArray(f.committee) ? f.committee : [];
  const eventPhotos = Array.isArray(f.eventPhotos) ? f.eventPhotos : [];
  const showDonate = Boolean(f.donationPhone);

  return (
    <>
      <PageHero
        title={f.name}
        subtitle={meta.label}
        image={cover ?? stockImages.heroFacilities}
        crumbs={[
          { label: "Facilities", href: "/facilities" },
          { label: meta.label, href: `/facilities?category=${f.category}` },
          { label: f.name },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link
          href={`/facilities?category=${f.category}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-amber-700 mb-8 transition"
        >
          <HiOutlineArrowLeft />
          Back to {meta.label}
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main */}
          <div className="space-y-8 min-w-0">
            {/* Cover + description */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt={f.name}
                  className="w-full aspect-[16/9] object-cover"
                />
              )}
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded text-[10px] uppercase tracking-widest font-bold mb-3">
                  {meta.label}
                </span>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight">
                  {f.name}
                </h1>
                {f.description && (
                  <p className="text-foreground/75 leading-relaxed mt-4">
                    {f.description}
                  </p>
                )}
              </div>
            </div>

            {/* Committee */}
            {committee.length > 0 && (
              <section className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-primary-dark tracking-tight mb-5">
                  <HiOutlineUserGroup className="text-xl text-amber-700" />
                  Committee
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {committee.map((m, i) => {
                    const photo = m.photo ? mediaUrl(m.photo) : null;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-amber-400 transition"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-cream overflow-hidden flex-shrink-0 ring-2 ring-white shadow">
                          {photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photo}
                              alt={m.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-xl font-extrabold text-primary">
                              {m.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-primary-dark truncate">
                            {m.name}
                          </div>
                          {m.title && (
                            <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mt-0.5">
                              {m.title}
                            </div>
                          )}
                          {m.phone && (
                            <a
                              href={`tel:${m.phone}`}
                              className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline mt-1"
                            >
                              <HiOutlinePhone className="text-xs" />
                              {m.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Event photos */}
            {eventPhotos.length > 0 && (
              <section className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-primary-dark tracking-tight mb-5">
                  <HiOutlinePhoto className="text-xl text-amber-700" />
                  Events & Activities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventPhotos.map((p, i) => {
                    const url = mediaUrl(p);
                    if (!url) return null;
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden border border-border group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Event ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            {/* Contact card */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wider mb-4">
                Contact
              </h2>
              <ul className="space-y-3 text-sm">
                {f.address && (
                  <li className="flex items-start gap-2.5 text-foreground/80">
                    <HiOutlineMapPin className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>{f.address}</span>
                  </li>
                )}
                {f.phone && (
                  <li className="flex items-start gap-2.5">
                    <HiOutlinePhone className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <a href={`tel:${f.phone}`} className="text-secondary hover:underline">
                      {f.phone}
                    </a>
                  </li>
                )}
                {f.email && (
                  <li className="flex items-start gap-2.5">
                    <HiOutlineEnvelope className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${f.email}`}
                      className="text-secondary hover:underline break-all"
                    >
                      {f.email}
                    </a>
                  </li>
                )}
                {f.website && (
                  <li className="flex items-start gap-2.5">
                    <HiOutlineGlobeAlt className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <a
                      href={f.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline break-all"
                    >
                      {f.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
                {!f.address && !f.phone && !f.email && !f.website && (
                  <li className="text-muted">No contact info provided.</li>
                )}
              </ul>
            </div>

            {/* Donation card */}
            {showDonate && (
              <div className="bg-primary-dark rounded-2xl p-6 shadow-md text-white">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineHeart className="text-amber-400 text-xl" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    Donate
                  </h2>
                </div>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Support this institution. Send your contribution via bKash to
                  the number below.
                </p>
                <a
                  href={`tel:${f.donationPhone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md transition uppercase tracking-wider text-sm"
                >
                  <HiOutlinePhone />
                  bKash · {f.donationPhone}
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
