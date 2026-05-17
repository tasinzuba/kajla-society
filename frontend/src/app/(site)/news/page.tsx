import Link from "next/link";
import { HiOutlineCalendar, HiOutlineUser, HiOutlineEye, HiArrowRight } from "react-icons/hi2";
import { listArticles } from "@/lib/articles";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "News & Articles" };
export const dynamic = "force-dynamic";

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  let data;
  try {
    data = await listArticles({ page, limit: 12, category: params.category });
  } catch (err) {
    return (
      <>
        <PageHero
          title="News & Articles"
          image={stockImages.heroAbout}
          crumbs={[{ label: "News" }]}
        />
        <div className="max-w-6xl mx-auto px-4 py-16">
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
        title="News & Articles"
        titleBn="সংবাদ ও নিবন্ধ"
        subtitle="Updates, stories, and announcements from Kajla Society."
        image={stockImages.heroAbout}
        crumbs={[{ label: "News" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {data.items.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlineCalendar className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="aspect-[16/10] bg-accent/30 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(a.coverImage) ?? stockImages.defaultArticle}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {a.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-white/95 backdrop-blur text-amber-800 rounded font-bold shadow">
                      {a.category.name}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg text-primary group-hover:text-secondary transition mb-2 line-clamp-2 tracking-tight">
                    {a.title}
                  </h2>
                  {a.excerpt && (
                    <p className="text-sm text-muted line-clamp-3 mb-4 leading-relaxed">
                      {a.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-muted flex items-center justify-between border-t border-border pt-3">
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineUser />
                      {a.author?.name ?? "Kajla"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineCalendar />
                      {formatDate(a.publishedAt ?? a.createdAt)}
                    </span>
                    {a.viewCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <HiOutlineEye />
                        {a.viewCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <Pagination
            current={data.page}
            total={data.totalPages}
            base={`/news${params.category ? `?category=${params.category}` : ""}`}
          />
        )}
      </div>
    </>
  );
}

function Pagination({
  current,
  total,
  base,
}: {
  current: number;
  total: number;
  base: string;
}) {
  const sep = base.includes("?") ? "&" : "?";
  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`${base}${sep}page=${p}`}
          className={`min-w-[40px] h-10 grid place-items-center rounded-lg text-sm font-semibold transition ${
            p === current
              ? "bg-amber-400 text-primary-dark shadow-md"
              : "bg-white border border-border hover:border-amber-400 text-foreground"
          }`}
        >
          {p}
        </Link>
      ))}
      {total > 1 && (
        <Link
          href={`${base}${sep}page=${Math.min(current + 1, total)}`}
          className="inline-flex items-center gap-1 px-4 h-10 rounded-lg text-sm font-semibold bg-white border border-border hover:border-primary"
        >
          Next <HiArrowRight />
        </Link>
      )}
    </div>
  );
}
