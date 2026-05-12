"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listMessages,
  deleteMessage,
  type ContactMessage,
} from "@/lib/contact";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterUnread, setFilterUnread] = useState(false);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMessages({ page, unread: filterUnread });
      setItems(data.items);
      setTotal(data.total);
      setUnreadCount(data.unreadCount);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, filterUnread]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSelect(m: ContactMessage) {
    setSelected({ ...m, isRead: true });
    if (!m.isRead) {
      // Mark read via list refresh; getMessage also auto-marks read
      setItems((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, isRead: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      if (selected?.id === id) setSelected(null);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Messages</h1>
          <p className="text-muted text-sm mt-1">
            {total} {total === 1 ? "message" : "messages"} ·{" "}
            <span className="text-warning font-semibold">{unreadCount} unread</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setPage(1);
              setFilterUnread(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              !filterUnread
                ? "bg-primary text-white"
                : "bg-surface border border-border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setPage(1);
              setFilterUnread(true);
            }}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filterUnread
                ? "bg-primary text-white"
                : "bg-surface border border-border"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[400px,1fr] gap-6">
        {/* List */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-muted">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted">No messages.</div>
          ) : (
            <ul>
              {items.map((m) => (
                <li
                  key={m.id}
                  className={`border-b border-border last:border-0 cursor-pointer transition ${
                    selected?.id === m.id
                      ? "bg-accent/30"
                      : "hover:bg-cream/50"
                  } ${!m.isRead ? "border-l-4 border-l-secondary" : ""}`}
                  onClick={() => onSelect(m)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span
                        className={`text-sm ${
                          m.isRead
                            ? "text-foreground"
                            : "text-primary font-bold"
                        }`}
                      >
                        {m.name}
                      </span>
                      <span className="text-[11px] text-muted whitespace-nowrap">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                    <div className="text-xs text-muted truncate">
                      {m.subject ?? "(no subject)"}
                    </div>
                    <div className="text-xs text-muted truncate mt-1">
                      {m.message}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-3 border-t border-border">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm ${
                    p === page
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="bg-surface border border-border rounded-lg p-6">
          {!selected ? (
            <div className="text-center text-muted py-16">
              Select a message to read
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    {selected.subject || "(no subject)"}
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    From <strong className="text-primary">{selected.name}</strong>{" "}
                    · {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(selected.id)}
                  className="text-xs text-danger hover:underline"
                >
                  Delete
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm border-y border-border py-3">
                <div>
                  <div className="text-xs text-muted uppercase tracking-wider mb-0.5">
                    Email
                  </div>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-secondary hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wider mb-0.5">
                      Phone
                    </div>
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-secondary hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                {selected.message}
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "")}`}
                  className="inline-block px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-light"
                >
                  Reply by email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
