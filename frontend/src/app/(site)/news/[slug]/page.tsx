import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineEye,
  HiArrowRight,
  HiOutlineMegaphone,
} from "react-icons/hi2";
import { FaThumbtack } from "react-icons/fa6";
import { getArticleBySlug, listArticles } from "@/lib/articles";
import { listNotices } from "@/lib/notices";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const a = await getArticleBySlug(slug);
    return {
      title: a.title,
      description: a.excerpt ?? undefined,
      openGraph: {
        title: a.title,
        description: a.excerpt ?? undefined,
        images: a.coverImage ? [mediaUrl(a.coverImage) ?? ""] : undefined,
      },
    };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch sidebar + related in parallel; failures are non-fatal
  const [noticesData, relatedData] = await Promise.all([
    listNotices({ page: 1 }).catch(() => null),
    listArticles({
      limit: 6,
      category: article.category?.slug ?? undefined,
    }).catch(() => null),
  ]);

  const noticeItems = (noticesData?.items ?? []).slice(0, 6);
  const related = (relatedData?.items ?? [])
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const publishedDate = formatDate(article.publishedAt ?? article.createdAt);

  return (
    <div className="bg-background">
      {/* Breadcrumb strip */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-primary">News</Link>
          <span>/</span>
          <span className="text-primary font-semibold truncate max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ============ MAIN COLUMN ============ */}
          <article className="lg:col-span-8 min-w-0">
            {/* Header */}
            <header className="mb-6 pb-6 border-b border-border">
              {article.category && (
                <Link
                  href={`/news?category=${article.category.slug}`}
                  className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 rounded font-bold mb-4 hover:bg-primary-dark hover:text-white transition-colors"
                >
                  {article.category.name}
                </Link>
              )}
              <h1 className="text-3xl lg:text-4xl xl:text-[2.75rem] font-extrabold text-primary-dark leading-[1.15] tracking-tight mb-3">
                {article.title}
              </h1>

              {/* Byline */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted mt-4">
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineUser className="text-primary" />
                  by{" "}
                  <span className="font-semibold text-foreground">
                    {article.author?.name ?? "Kajla Society"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineCalendar className="text-primary" />
                  {publishedDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineEye className="text-primary" />
                  {article.viewCount} views
                </span>
              </div>
            </header>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-foreground/85 leading-relaxed mb-8 pl-5 border-l-4 border-emerald bg-emerald-faint/50 py-4 pr-5 rounded-r-lg">
                {article.excerpt}
              </p>
            )}

            {/* Cover image */}
            {article.coverImage && (
              <figure className="mb-8 rounded-2xl overflow-hidden border border-border shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(article.coverImage) ?? ""}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </figure>
            )}

            {/* Body */}
            <div
              className="prose-kajla"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Bottom bar — back link */}
            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-emerald-dark transition"
              >
                <HiOutlineArrowLeft />
                Back to all news
              </Link>
              <span className="text-xs text-muted">
                Published {publishedDate}
              </span>
            </div>

            {/* ============ RELATED ============ */}
            {related.length > 0 && (
              <section className="mt-14 pt-10 border-t-2 border-border">
                <div className="flex items-end justify-between mb-6">
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight">
                    Related
                  </h2>
                  <Link
                    href="/news"
                    className="text-sm font-bold text-primary hover:text-emerald-dark inline-flex items-center gap-1.5 group"
                  >
                    All news
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((r) => {
                    const cover = mediaUrl(r.coverImage);
                    return (
                      <Link
                        key={r.id}
                        href={`/news/${r.slug}`}
                        className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover}
                              alt={r.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary to-emerald-dark text-white text-xl font-bold">
                              {r.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          {r.category && (
                            <span className="text-[10px] uppercase tracking-wider text-emerald-dark font-bold mb-1.5">
                              {r.category.name}
                            </span>
                          )}
                          <h3 className="font-bold text-primary-dark text-sm leading-snug line-clamp-3 group-hover:text-emerald-dark transition-colors mb-2">
                            {r.title}
                          </h3>
                          <div className="text-[11px] text-muted mt-auto">
                            {formatDate(r.publishedAt ?? r.createdAt)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </article>

          {/* ============ SIDEBAR ============ */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Notice Board widget */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm sticky top-28">
              <div className="bg-primary-dark text-white px-5 py-3 flex items-center gap-2">
                <HiOutlineMegaphone className="text-lg" />
                <h3 className="font-extrabold uppercase tracking-wider text-sm">
                  Notice Board
                </h3>
              </div>

              {noticeItems.length === 0 ? (
                <div className="px-5 py-8 text-sm text-muted text-center">
                  No notices yet.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {noticeItems.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/notices/${n.id}`}
                        className="block px-5 py-4 hover:bg-emerald-faint/40 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          {n.isPinned && (
                            <FaThumbtack className="text-emerald text-xs mt-1 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-primary-dark leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                              {n.title}
                            </div>
                            <div className="text-[11px] text-muted mt-1">
                              {formatDate(n.publishedAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/notices"
                className="block px-5 py-3 text-xs font-bold uppercase tracking-wider text-center text-emerald-dark hover:bg-emerald-faint/60 border-t border-border transition-colors"
              >
                View all notices →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
