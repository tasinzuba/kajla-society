import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";
import { FaThumbtack } from "react-icons/fa6";
import { getNotice } from "@/lib/notices";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const n = await getNotice(id);
    return { title: n.title };
  } catch {
    return { title: "Notice not found" };
  }
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let notice;
  try {
    notice = await getNotice(id);
  } catch {
    notFound();
  }

  return (
    <>
      <PageHero
        title={notice.title}
        titleBn={notice.titleBn}
        image={stockImages.heroNotices}
        crumbs={[{ label: "Notice", href: "/notices" }, { label: "Detail" }]}
      />

      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline mb-6"
        >
          <HiOutlineArrowLeft />
          Back to notice board
        </Link>

        {notice.isPinned && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest bg-primary text-white rounded-full font-bold mb-4">
            <FaThumbtack className="text-xs" /> Pinned Notice
          </span>
        )}

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted mb-8 pb-5 border-b border-border">
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineUser className="text-primary" />
            <span className="font-semibold text-foreground">
              {notice.author?.name ?? "Kajla Society"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineCalendar className="text-primary" />
            {formatDate(notice.publishedAt)}
          </span>
        </div>

        <div
          className="prose-kajla"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />

        {notice.attachment && (
          <div className="mt-10 p-6 bg-gradient-to-br from-accent/40 to-cream rounded-2xl border border-border">
            <h3 className="font-bold text-primary mb-3 inline-flex items-center gap-2">
              <HiOutlineDocumentArrowDown className="text-xl" />
              Attachment
            </h3>
            <a
              href={mediaUrl(notice.attachment) ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-primary-dark rounded-md font-bold transition shadow-md hover:shadow-lg uppercase tracking-wider text-sm"
            >
              <HiOutlineDocumentArrowDown />
              Download attachment
            </a>
          </div>
        )}
      </article>
    </>
  );
}
