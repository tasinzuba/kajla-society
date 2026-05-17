import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { getEventBySlug } from "@/lib/events";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const e = await getEventBySlug(slug);
    return {
      title: e.title,
      description: `Event on ${new Date(e.startsAt).toLocaleDateString()}${e.location ? ` at ${e.location}` : ""}`,
    };
  } catch {
    return { title: "Event not found" };
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let event;
  try {
    event = await getEventBySlug(slug);
  } catch {
    notFound();
  }

  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;
  const isPast = start < new Date();

  const dateLabel = start.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = start.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      {/* Hero cover */}
      {event.coverImage && (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(event.coverImage) ?? ""}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 max-w-3xl mx-auto px-4 pb-12 text-white">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-4 transition"
            >
              <HiOutlineArrowLeft />
              Back to events
            </Link>
            {isPast && (
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-white/20 backdrop-blur text-white rounded-full font-bold mb-4">
                Past event
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {event.title}
            </h1>
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {!event.coverImage && (
          <>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-secondary hover:underline mb-6"
            >
              <HiOutlineArrowLeft />
              Back to events
            </Link>
            <header className="mb-8">
              {isPast && (
                <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-muted/20 text-muted rounded-full font-bold mb-4">
                  Past event
                </span>
              )}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight tracking-tight mb-3">
                {event.title}
              </h1>
            </header>
          </>
        )}

        {/* Info card */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-10 grid sm:grid-cols-3 gap-5 shadow-sm">
          <InfoItem Icon={HiOutlineCalendar} label="Date" value={dateLabel} />
          <InfoItem
            Icon={HiOutlineClock}
            label="Time"
            value={`${timeLabel}${end ? ` – ${end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })}` : ""}`}
          />
          {event.location && (
            <InfoItem Icon={HiOutlineMapPin} label="Location" value={event.location} />
          )}
        </div>

        <div
          className="prose-kajla"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </article>
    </>
  );
}

function InfoItem({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent text-primary grid place-items-center flex-shrink-0">
        <Icon className="text-lg" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-0.5">
          {label}
        </div>
        <div className="font-semibold text-primary text-sm">{value}</div>
      </div>
    </div>
  );
}
