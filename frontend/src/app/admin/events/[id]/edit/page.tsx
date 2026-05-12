"use client";

import { use, useEffect, useState } from "react";
import { EventForm } from "@/components/admin/EventForm";
import { adminGetEvent, type EventDetail } from "@/lib/events";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetEvent(id)
      .then(setEvent)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="px-4 py-8 text-danger">Failed to load: {error}</div>;
  if (!event) return <div className="px-4 py-8 text-muted">Loading...</div>;

  return <EventForm initial={event} />;
}
