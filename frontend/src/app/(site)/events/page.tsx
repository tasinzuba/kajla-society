import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineClock,
} from "react-icons/hi2";
import { listEvents, type EventScope, type EventListItem } from "@/lib/events";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const metadata = { title: "Events" };
export const dynamic = "force-dynamic";

const tabs: { key: EventScope; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
];

export default async function EventsListPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string; page?: string }>;
}) {
  const params = await searchParams;
  const scope: EventScope = tabs.find((t) => t.key === params.scope)?.key ?? "upcoming";
  const page = Math.max(1, Number(params.page ?? 1));

  let data;
  try {
    data = await listEvents({ scope, page, limit: 12 });
  } catch (err) {
    return (
      <>
        <PageHero title="Events" image={stockImages.heroEvents} crumbs={[{ label: "Events" }]} />
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
        title="Events"
        titleBn="ইভেন্ট"
        subtitle="Stay connected with Kajla Society community events and gatherings."
        image={stockImages.heroEvents}
        crumbs={[{ label: "Events" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-10 p-1 bg-white border border-border rounded-xl w-fit shadow-sm">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/events?scope=${t.key}`}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                scope === t.key
                  ? "bg-amber-400 text-primary-dark shadow"
                  : "text-muted hover:text-primary-dark"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {data.items.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlineCalendarDays className="text-3xl text-primary" />
            </div>
            <p className="text-muted">
              No {scope === "past" ? "past " : scope === "upcoming" ? "upcoming " : ""}events.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                isPast={scope === "past" || new Date(e.startsAt) < new Date()}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 flex-wrap">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/events?scope=${scope}&page=${p}`}
                className={`min-w-[40px] h-10 grid place-items-center rounded-lg text-sm font-semibold transition ${
                  p === data.page
                    ? "bg-amber-400 text-primary-dark shadow-md"
                    : "bg-white border border-border hover:border-amber-400"
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

function EventCard({ event, isPast }: { event: EventListItem; isPast: boolean }) {
  const start = new Date(event.startsAt);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1 flex flex-col"
    >
      <div className="aspect-[16/10] bg-accent/30 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(event.coverImage) ?? stockImages.defaultEvent}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-lg px-3 py-2 text-center min-w-[64px]">
          <div className="text-[10px] uppercase tracking-wider text-secondary font-bold">
            {start.toLocaleString("en-US", { month: "short" })}
          </div>
          <div className="text-2xl font-extrabold text-primary leading-none mt-0.5">
            {start.getDate()}
          </div>
        </div>
        {isPast && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-black/70 text-white rounded-full font-bold backdrop-blur">
            Past
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-bold text-lg text-primary group-hover:text-secondary transition mb-3 line-clamp-2 tracking-tight">
          {event.title}
        </h2>
        <div className="text-sm text-muted space-y-1.5 mt-auto">
          <div className="inline-flex items-center gap-2">
            <HiOutlineClock className="text-primary" />
            {formatDate(event.startsAt)}
          </div>
          {event.location && (
            <div className="inline-flex items-center gap-2">
              <HiOutlineMapPin className="text-primary" />
              {event.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
