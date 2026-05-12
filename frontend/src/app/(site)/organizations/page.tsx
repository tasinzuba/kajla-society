import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { FaHandshake } from "react-icons/fa6";
import { listFacilitiesPublic, type Facility } from "@/lib/facilities";
import { mediaUrl } from "@/lib/media";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Organizations" };
export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  let orgs: Facility[] = [];
  try {
    const grouped = await listFacilitiesPublic();
    orgs = grouped.COMMUNITY_ORG ?? [];
  } catch {
    orgs = [];
  }

  return (
    <>
      <PageHero
        title="Community Organizations"
        titleBn="সম্প্রদায় সংগঠনসমূহ"
        subtitle="Community-led organizations and associations operating in Kajla."
        image={stockImages.heroOrganizations}
        crumbs={[{ label: "Organizations" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {orgs.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <FaHandshake className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No organizations listed yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orgs.map((o) => (
              <div
                key={o.id}
                className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                {o.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(o.image) ?? ""}
                    alt={o.name}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark grid place-items-center text-white text-xl shadow mb-3">
                    <FaHandshake />
                  </div>
                  <h3 className="font-bold text-lg text-primary tracking-tight">
                    {o.name}
                  </h3>
                  {o.nameBn && (
                    <p className="text-xs text-muted font-bn mt-0.5" lang="bn">
                      {o.nameBn}
                    </p>
                  )}
                  {o.description && (
                    <p className="text-sm text-muted mt-2 line-clamp-3 leading-relaxed">
                      {o.description}
                    </p>
                  )}
                  <div className="mt-4 space-y-2 text-sm border-t border-border pt-3">
                    {o.address && (
                      <div className="flex items-start gap-2 text-foreground/80">
                        <HiOutlineMapPin className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{o.address}</span>
                      </div>
                    )}
                    {o.phone && (
                      <div className="flex items-start gap-2">
                        <HiOutlinePhone className="text-primary flex-shrink-0 mt-0.5" />
                        <a href={`tel:${o.phone}`} className="text-secondary hover:underline">
                          {o.phone}
                        </a>
                      </div>
                    )}
                    {o.email && (
                      <div className="flex items-start gap-2">
                        <HiOutlineEnvelope className="text-primary flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${o.email}`}
                          className="text-secondary hover:underline truncate"
                        >
                          {o.email}
                        </a>
                      </div>
                    )}
                    {o.website && (
                      <div className="flex items-start gap-2">
                        <HiOutlineGlobeAlt className="text-primary flex-shrink-0 mt-0.5" />
                        <a
                          href={o.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:underline truncate"
                        >
                          {o.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
