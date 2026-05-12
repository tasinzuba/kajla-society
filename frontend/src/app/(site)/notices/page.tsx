import Link from "next/link";
import {
  HiOutlineMegaphone,
  HiOutlineDocumentArrowDown,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { FaThumbtack } from "react-icons/fa6";
import { listNotices } from "@/lib/notices";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Notice Board" };
export const dynamic = "force-dynamic";

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  let data;
  try {
    data = await listNotices({ page });
  } catch (err) {
    return (
      <>
        <PageHero title="Notice Board" image={stockImages.heroNotices} crumbs={[{ label: "Notice" }]} />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <p className="text-danger">
            Failed to load: {err instanceof Error ? err.message : "Unknown"}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Notice Board"
        titleBn="নোটিশ বোর্ড"
        subtitle="Official notices, announcements, and circulars from Kajla Society."
        image={stockImages.heroNotices}
        crumbs={[{ label: "Notice" }]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {data.items.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlineMegaphone className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No notices posted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((n) => (
              <Link
                key={n.id}
                href={`/notices/${n.id}`}
                className={`group block bg-white rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 ${
                  n.isPinned
                    ? "border-l-4 border-l-primary border border-border"
                    : "border border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl grid place-items-center flex-shrink-0 ${
                      n.isPinned
                        ? "bg-primary text-white"
                        : "bg-accent text-primary"
                    }`}
                  >
                    {n.isPinned ? (
                      <FaThumbtack className="text-lg" />
                    ) : (
                      <HiOutlineMegaphone className="text-xl" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {n.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-primary text-white rounded-full font-bold">
                          Pinned
                        </span>
                      )}
                      {n.attachment && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-accent text-primary rounded-full font-bold">
                          <HiOutlineDocumentArrowDown className="text-sm" />
                          Attachment
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold text-lg text-primary group-hover:text-secondary transition tracking-tight">
                      {n.title}
                    </h2>
                    {n.titleBn && (
                      <p className="text-sm text-muted font-bn mt-0.5" lang="bn">
                        {n.titleBn}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted mt-2">
                      <HiOutlineCalendar />
                      {formatDate(n.publishedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/notices?page=${p}`}
                className={`min-w-[40px] h-10 grid place-items-center rounded-lg text-sm font-semibold transition ${
                  p === data.page
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-border hover:border-primary"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
