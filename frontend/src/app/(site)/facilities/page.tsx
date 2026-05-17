import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
} from "react-icons/hi2";
import {
  FaMosque,
  FaGraduationCap,
  FaHospital,
  FaHelmetSafety,
  FaCartShopping,
  FaLandmark,
  FaHandshake,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  listFacilitiesPublic,
  CATEGORY_META,
  ALL_CATEGORIES,
  type FacilityCategory,
  type Facility,
} from "@/lib/facilities";
import { mediaUrl } from "@/lib/media";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Facilities" };
export const dynamic = "force-dynamic";

const CATEGORY_ICON: Record<FacilityCategory, IconType> = {
  RELIGIOUS: FaMosque,
  EDUCATIONAL: FaGraduationCap,
  HEALTH_EMERGENCY: FaHospital,
  CONSTRUCTION: FaHelmetSafety,
  LOCAL_SERVICES: FaCartShopping,
  GOVERNMENT: FaLandmark,
  COMMUNITY_ORG: FaHandshake,
};

export default async function FacilitiesPage() {
  let grouped: Awaited<ReturnType<typeof listFacilitiesPublic>>;
  try {
    grouped = await listFacilitiesPublic();
  } catch (err) {
    return (
      <>
        <PageHero
          title="Facilities"
          image={stockImages.heroFacilities}
          crumbs={[{ label: "Facilities" }]}
        />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-danger">
            Failed to load: {err instanceof Error ? err.message : "Unknown"}
          </p>
        </div>
      </>
    );
  }

  const allEmpty = ALL_CATEGORIES.every(
    (c) => !grouped[c] || grouped[c].length === 0
  );

  return (
    <>
      <PageHero
        title="Community Facilities"
        subtitle="Local services, institutions, and emergency contacts in and around Kajla."
        image={stockImages.heroFacilities}
        crumbs={[{ label: "Facilities" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category jump pills */}
        {!allEmpty && (
          <div className="flex flex-wrap gap-2 mb-12">
            {ALL_CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c];
              const count = grouped[c]?.length ?? 0;
              if (count === 0) return null;
              const Icon = CATEGORY_ICON[c];
              return (
                <a
                  key={c}
                  href={`#${meta.href}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-border rounded-xl hover:border-primary hover:bg-accent/30 transition-all shadow-sm hover:shadow"
                >
                  <Icon className="text-primary" />
                  <span className="text-foreground font-medium">
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted bg-accent px-1.5 py-0.5 rounded-full font-bold">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {allEmpty ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <FaMosque className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No facilities listed yet.</p>
          </div>
        ) : (
          ALL_CATEGORIES.map((category) => {
            const items = grouped[category] ?? [];
            if (items.length === 0) return null;
            const meta = CATEGORY_META[category];
            const Icon = CATEGORY_ICON[category];

            return (
              <section
                key={category}
                id={meta.href}
                className="mb-16 scroll-mt-24"
              >
                <header className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark grid place-items-center text-white text-2xl shadow-lg flex-shrink-0">
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-primary tracking-tight">
                      {meta.label}
                    </h2>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted whitespace-nowrap">
                    {items.length} listed
                  </span>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((f) => (
                    <FacilityCard key={f.id} f={f} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}

function FacilityCard({ f }: { f: Facility }) {
  const CategoryIcon = CATEGORY_ICON[f.category];
  const cover = mediaUrl(f.image);
  const showDonate = f.category === "RELIGIOUS" && f.donationPhone;

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1 flex flex-col">
      {/* Image area — always shown (placeholder when no image) */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-accent to-cream overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={f.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-primary/30">
            <CategoryIcon className="text-7xl" />
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur text-primary-dark rounded-md text-[10px] uppercase tracking-wider font-bold shadow">
          <CategoryIcon />
          {CATEGORY_META[f.category].label}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-primary tracking-tight">
          {f.name}
        </h3>
        {f.description && (
          <p className="text-sm text-muted mt-2 line-clamp-3 leading-relaxed">
            {f.description}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm border-t border-border pt-3 flex-1">
          {f.address && (
            <div className="flex items-start gap-2 text-foreground/80">
              <HiOutlineMapPin className="text-primary flex-shrink-0 mt-0.5" />
              <span>{f.address}</span>
            </div>
          )}
          {f.phone && (
            <div className="flex items-start gap-2">
              <HiOutlinePhone className="text-primary flex-shrink-0 mt-0.5" />
              <a href={`tel:${f.phone}`} className="text-secondary hover:underline">
                {f.phone}
              </a>
            </div>
          )}
          {f.email && (
            <div className="flex items-start gap-2">
              <HiOutlineEnvelope className="text-primary flex-shrink-0 mt-0.5" />
              <a
                href={`mailto:${f.email}`}
                className="text-secondary hover:underline truncate"
              >
                {f.email}
              </a>
            </div>
          )}
          {f.website && (
            <div className="flex items-start gap-2">
              <HiOutlineGlobeAlt className="text-primary flex-shrink-0 mt-0.5" />
              <a
                href={f.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline truncate"
              >
                {f.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* Donate button — only for Religious facilities with donation phone */}
        {showDonate && (
          <a
            href={`tel:${f.donationPhone}`}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-md transition-all hover:-translate-y-0.5 uppercase tracking-wider text-sm"
          >
            <HiOutlineHeart className="text-base" />
            Donate · {f.donationPhone}
          </a>
        )}
      </div>
    </div>
  );
}
