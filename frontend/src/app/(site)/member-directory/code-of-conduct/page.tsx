import Link from "next/link";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { getPublicPage } from "@/lib/pages";

export const metadata = { title: "Code of Conduct" };
export const dynamic = "force-dynamic";

export default async function CodeOfConductPage() {
  let page;
  try {
    page = await getPublicPage("code-of-conduct");
  } catch {
    page = null;
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight">
          Code of Conduct
        </h2>
        <p className="text-muted mt-2">
          Rules and guidelines for all members and stakeholders of Kajla Society.
        </p>
      </div>

      {page ? (
        <article className="bg-white border border-border rounded-md p-6 lg:p-8 shadow-sm">
          <div
            className="prose-kajla max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      ) : (
        <div className="bg-white border border-border rounded-md p-10 lg:p-14 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 grid place-items-center">
            <HiOutlineDocumentText className="text-2xl text-amber-700" />
          </div>
          <h3 className="font-bold text-primary-dark mb-2">
            Content not set up yet
          </h3>
          <p className="text-muted text-sm max-w-md mx-auto mb-4">
            The admin can add this page&apos;s content from the admin panel
            using slug <span className="font-mono">code-of-conduct</span>.
          </p>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:text-amber-700"
          >
            Go to admin →
          </Link>
        </div>
      )}
    </>
  );
}
