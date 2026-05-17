import { PageHero } from "@/components/site/PageHero";
import { MemberDirectoryNav } from "@/components/site/MemberDirectoryNav";
import { stockImages } from "@/lib/images";

export default function MemberDirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        title="Member Directory"
        subtitle="Society members, registration, services, and code of conduct."
        image={stockImages.heroMembers}
        crumbs={[{ label: "Member Directory" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-[280px_1fr] gap-8">
        <MemberDirectoryNav />
        <main className="min-w-0">{children}</main>
      </div>
    </>
  );
}
