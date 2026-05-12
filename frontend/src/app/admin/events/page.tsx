"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListEvents,
  deleteEvent,
  type EventListItem,
} from "@/lib/events";
import { formatDate } from "@/lib/utils";

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListEvents({ page, q: q || undefined });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteEvent(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Events</h1>
          <p className="text-muted text-sm mt-1">
            {total} {total === 1 ? "event" : "events"} total
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Event
        </Link>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search events..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className="w-full max-w-md px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream text-xs uppercase text-muted tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted">
                  No events yet.{" "}
                  <Link
                    href="/admin/events/new"
                    className="text-secondary underline"
                  >
                    Create your first event
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((e) => {
                const isPast = new Date(e.startsAt) < new Date();
                return (
                  <tr
                    key={e.id}
                    className="border-t border-border hover:bg-cream/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/events/${e.id}/edit`}
                        className="font-semibold text-primary hover:text-secondary"
                      >
                        {e.title}
                      </Link>
                      <div className="text-xs text-muted mt-0.5">/{e.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                      {e.location ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-primary font-semibold">
                        {formatDate(e.startsAt)}
                      </div>
                      <div className="text-xs text-muted">
                        {isPast ? "Past" : "Upcoming"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {e.isPublished ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-success/15 text-success rounded font-semibold">
                          Live
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-warning/15 text-warning rounded font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {e.isPublished && (
                          <Link
                            href={`/events/${e.slug}`}
                            target="_blank"
                            className="px-2 py-1 text-xs text-secondary hover:underline"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/events/${e.id}/edit`}
                          className="px-2 py-1 text-xs text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(e.id, e.title)}
                          className="px-2 py-1 text-xs text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded ${
                p === page
                  ? "bg-primary text-white"
                  : "bg-surface border border-border hover:border-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
