import Link from "next/link";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiArrowRight,
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

function isCategory(v: string | undefined): v is FacilityCategory {
  return !!v && (ALL_CATEGORIES as string[]).includes(v);
}

export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = isCategory(rawCategory) ? rawCategory : null;

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

  // Which categories to render: only the active one, or all if none selected
  const categoriesToShow = activeCategory ? [activeCategory] : ALL_CATEGORIES;

  return (
    <>
      <PageHero
        title="Community Facilities"
        subtitle="Local services, institutions, and emergency contacts in and around Kajla."
        image={stockImages.heroFacilities}
        crumbs={[{ label: "Facilities" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category filter pills */}
        {!allEmpty && (
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/facilities"
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-all ${
                !activeCategory
                  ? "bg-amber-400 border-amber-400 text-primary-dark font-bold shadow"
                  : "bg-white border-border text-foreground hover:border-amber-400"
              }`}
            >
              All Categories
            </Link>
            {ALL_CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c];
              const count = grouped[c]?.length ?? 0;
              if (count === 0) return null;
              const Icon = CATEGORY_ICON[c];
              const active = activeCategory === c;
              return (
                <Link
                  key={c}
                  href={`/facilities?category=${c}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-all ${
                    active
                      ? "bg-amber-400 border-amber-400 text-primary-dark font-bold shadow"
                      : "bg-white border-border text-foreground hover:border-amber-400"
                  }`}
                >
                  <Icon className={active ? "text-primary-dark" : "text-amber-700"} />
                  <span className="font-medium">{meta.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      active ? "bg-primary-dark/10 text-primary-dark" : "bg-accent text-primary"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
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
          categoriesToShow.map((category) => {
            const items = grouped[category] ?? [];
            if (items.length === 0) {
              // When a specific empty category is selected, show a message
              if (activeCategory) {
                const meta = CATEGORY_META[category];
                return (
                  <div
                    key={category}
                    className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm"
                  >
                    <p className="text-muted">
                      No {meta.label.toLowerCase()} listed yet.
                    </p>
                  </div>
                );
              }
              return null;
            }
            const meta = CATEGORY_META[category];
            const Icon = CATEGORY_ICON[category];

            return (
              <section key={category} className="mb-16 scroll-mt-24">
                <header className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-md bg-primary-dark grid place-items-center text-amber-400 text-2xl shadow-lg flex-shrink-0">
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

  return (
    <Link
      href={`/facilities/${f.id}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-400 transition-all hover:-translate-y-1 flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-accent to-cream overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={f.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-primary/30">
            <CategoryIcon className="text-7xl" />
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur text-primary-dark rounded-md text-[10px] uppercase tracking-wider font-bold shadow">
          <CategoryIcon />
          {CATEGORY_META[f.category].label}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-primary tracking-tight group-hover:text-amber-700 transition">
          {f.name}
        </h3>
        {f.description && (
          <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
            {f.description}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm border-t border-border pt-3 flex-1">
          {f.address && (
            <div className="flex items-start gap-2 text-foreground/80">
              <HiOutlineMapPin className="text-amber-700 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{f.address}</span>
            </div>
          )}
          {f.phone && (
            <div className="flex items-start gap-2 text-foreground/80">
              <HiOutlinePhone className="text-amber-700 flex-shrink-0 mt-0.5" />
              <span>{f.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-amber-700 group-hover:gap-2.5 transition-all">
          View details
          <HiArrowRight />
        </div>
      </div>
    </Link>
  );
}
