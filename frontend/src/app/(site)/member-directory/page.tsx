import {
  HiOutlineUserGroup,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { listCommitteePublic, type TermGroup } from "@/lib/committee";
import { mediaUrl } from "@/lib/media";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Member Directory" };
export const dynamic = "force-dynamic";

export default async function MemberDirectoryPage() {
  let terms: TermGroup[] = [];
  try {
    terms = await listCommitteePublic();
  } catch {
    terms = [];
  }

  return (
    <>
      <PageHero
        title="Member Directory"
        titleBn="সদস্য তালিকা"
        subtitle="Executive committee members of Kajla Society — present and past."
        image={stockImages.heroMembers}
        crumbs={[{ label: "Member Directory" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {terms.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlineUserGroup className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No committee members listed yet.</p>
          </div>
        ) : (
          terms.map(({ term, members }, idx) => (
            <section key={term} className="mb-16">
              <header className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-primary tracking-tight">
                  Term {term}
                </h2>
                {idx === 0 && (
                  <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-green-100 text-green-700 rounded-full font-bold">
                    Current
                  </span>
                )}
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted whitespace-nowrap">
                  {members.length} {members.length === 1 ? "member" : "members"}
                </span>
              </header>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-[4/5] bg-gradient-to-br from-accent to-cream relative overflow-hidden">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaUrl(m.photo) ?? ""}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-8xl text-primary/30 font-extrabold">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <p className="text-xs uppercase tracking-wider text-accent font-bold">
                          {m.role}
                        </p>
                        {m.roleBn && (
                          <p
                            className="text-xs text-white/85 font-bn"
                            lang="bn"
                          >
                            {m.roleBn}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-primary tracking-tight">
                        {m.name}
                      </h3>
                      {m.nameBn && (
                        <p className="text-xs text-muted font-bn" lang="bn">
                          {m.nameBn}
                        </p>
                      )}
                      {m.bio && (
                        <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">
                          {m.bio}
                        </p>
                      )}
                      <div className="mt-4 space-y-1.5 text-xs">
                        {m.phone && (
                          <a
                            href={`tel:${m.phone}`}
                            className="inline-flex items-center gap-2 text-secondary hover:underline w-full"
                          >
                            <HiOutlinePhone className="text-primary" />
                            {m.phone}
                          </a>
                        )}
                        {m.email && (
                          <a
                            href={`mailto:${m.email}`}
                            className="inline-flex items-center gap-2 text-secondary hover:underline truncate w-full"
                          >
                            <HiOutlineEnvelope className="text-primary" />
                            {m.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
