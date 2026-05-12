import { getPublicPage } from "@/lib/pages";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const p = await getPublicPage("about");
    return {
      title: p.metaTitle || p.title,
      description: p.metaDesc ?? undefined,
    };
  } catch {
    return { title: "About Us" };
  }
}

export default async function AboutPage() {
  let page;
  try {
    page = await getPublicPage("about");
  } catch {
    return (
      <>
        <PageHero
          title="About Us"
          titleBn="আমাদের সম্পর্কে"
          image={stockImages.heroAbout}
          crumbs={[{ label: "About" }]}
        />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-muted">
            Page content has not been set up yet. Admin can edit this from the
            admin panel.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={page.title}
        titleBn={page.titleBn}
        image={stockImages.heroAbout}
        crumbs={[{ label: "About" }]}
      />

      <article className="max-w-4xl mx-auto px-4 py-16">
        <div
          className="prose-kajla mx-auto"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </>
  );
}
