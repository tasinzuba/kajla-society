"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  listAdoptionRequests,
  deleteAdoption,
  type AdoptionRequest,
  type ApplicationStatus,
  type AdoptionTarget,
} from "@/lib/applications";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";

const STATUSES: (ApplicationStatus | "")[] = ["", "PENDING", "APPROVED", "REJECTED"];
const TARGETS: (AdoptionTarget | "")[] = ["", "ROAD", "GATE"];

export default function AdminAdoptionsListPage() {
  const [items, setItems] = useState<AdoptionRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [target, setTarget] = useState<AdoptionTarget | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdoptionRequests({
        page,
        status: status || undefined,
        target: target || undefined,
      });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, status, target]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete adoption request from ${name}?`)) return;
    try {
      await deleteAdoption(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Adoption Requests</h1>
        <p className="text-muted text-sm mt-1">
          {total} {total === 1 ? "request" : "requests"} total
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs uppercase tracking-wider text-muted self-center mr-2">
          Status:
        </span>
        {STATUSES.map((s) => (
          <button
            key={s || "all"}
            onClick={() => {
              setPage(1);
              setStatus(s);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              status === s
                ? "bg-primary text-white"
                : "bg-surface border border-border hover:border-secondary"
            }`}
          >
            {s || "All"}
          </button>
        ))}
        <span className="text-xs uppercase tracking-wider text-muted self-center ml-4 mr-2">
          Type:
        </span>
        {TARGETS.map((t) => (
          <button
            key={t || "all"}
            onClick={() => {
              setPage(1);
              setTarget(t);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              target === t
                ? "bg-secondary text-white"
                : "bg-surface border border-border hover:border-secondary"
            }`}
          >
            {t || "All"}
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
              <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Location</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-4 py-3 hidden lg:table-cell">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted">No requests.</td></tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/adoptions/${a.id}`}
                      className="font-semibold text-primary hover:text-secondary"
                    >
                      {a.applicantName}
                    </Link>
                    {a.organization && (
                      <div className="text-xs text-muted">{a.organization}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold ${
                        a.target === "ROAD"
                          ? "bg-secondary/15 text-secondary"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      {a.target === "ROAD" ? "🛣 Road" : "🚪 Gate"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    {a.locationRef}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted hidden lg:table-cell">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/admin/applications/adoptions/${a.id}`}
                        className="px-2 py-1 text-xs text-primary hover:underline"
                      >
                        Review
                      </Link>
                      <button
                        onClick={() => onDelete(a.id, a.applicantName)}
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
