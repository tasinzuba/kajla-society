import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineEye,
} from "react-icons/hi2";
import { getArticleBySlug } from "@/lib/articles";
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

  return (
    <>
      {/* Hero cover */}
      {article.coverImage && (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(article.coverImage) ?? ""}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 max-w-3xl mx-auto px-4 pb-12 text-white">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-4 transition"
            >
              <HiOutlineArrowLeft />
              Back to news
            </Link>
            {article.category && (
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-white text-primary rounded-full font-bold mb-4">
                {article.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {article.title}
            </h1>
            {article.titleBn && (
              <p className="text-lg md:text-xl text-white/85 font-bn mt-3" lang="bn">
                {article.titleBn}
              </p>
            )}
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {!article.coverImage && (
          <>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline mb-6"
            >
              <HiOutlineArrowLeft />
              Back to news
            </Link>
            <header className="mb-8">
              {article.category && (
                <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-accent text-primary rounded-full font-bold mb-4">
                  {article.category.name}
                </span>
              )}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight mb-3 tracking-tight">
                {article.title}
              </h1>
              {article.titleBn && (
                <p className="text-xl text-muted font-bn" lang="bn">
                  {article.titleBn}
                </p>
              )}
            </header>
          </>
        )}

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted mb-8 pb-5 border-b border-border">
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineUser className="text-primary" />
            <span className="font-semibold text-foreground">
              {article.author?.name ?? "Kajla Society"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineCalendar className="text-primary" />
            {formatDate(article.publishedAt ?? article.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineEye className="text-primary" />
            {article.viewCount} views
          </span>
        </div>

        {article.excerpt && (
          <p className="text-lg text-foreground/85 leading-relaxed mb-8 pl-5 border-l-4 border-primary italic bg-accent/30 py-4 pr-5 rounded-r-lg">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose-kajla"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}
