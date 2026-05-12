"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  listCarStickerApplications,
  deleteCarSticker,
  type CarStickerApplication,
  type ApplicationStatus,
} from "@/lib/applications";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";

const STATUSES: (ApplicationStatus | "")[] = ["", "PENDING", "APPROVED", "REJECTED"];

export default function AdminCarStickerListPage() {
  const [items, setItems] = useState<CarStickerApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCarStickerApplications({
        page,
        status: status || undefined,
      });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete application from ${name}?`)) return;
    try {
      await deleteCarSticker(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Car Sticker Applications</h1>
        <p className="text-muted text-sm mt-1">
          {total} {total === 1 ? "application" : "applications"} total
        </p>
      </div>

      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button
            key={s || "all"}
            onClick={() => {
              setPage(1);
              setStatus(s);
            }}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              status === s
                ? "bg-primary text-white"
                : "bg-surface border border-border hover:border-secondary"
            }`}
          >
            {s || "All"}
          </button>
        ))}
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
              <th className="text-left px-4 py-3">Applicant</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Vehicle</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Registration</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted">No applications.</td></tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/car-sticker/${c.id}`}
                      className="font-semibold text-primary hover:text-secondary"
                    >
                      {c.fullName}
                    </Link>
                    <div className="text-xs text-muted">H#{c.houseNo}</div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    <div className="font-semibold">{c.brandModel}</div>
                    <div className="text-xs text-muted">{c.vehicleType}{c.color ? ` · ${c.color}` : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-xs hidden lg:table-cell">
                    <code className="bg-cream px-2 py-1 rounded">{c.registrationNo}</code>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted hidden md:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/admin/applications/car-sticker/${c.id}`}
                        className="px-2 py-1 text-xs text-primary hover:underline"
                      >
                        Review
                      </Link>
                      <button
                        onClick={() => onDelete(c.id, c.fullName)}
                        className="px-2 py-1 text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
                p === page ? "bg-primary text-white" : "bg-surface border border-border"
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
