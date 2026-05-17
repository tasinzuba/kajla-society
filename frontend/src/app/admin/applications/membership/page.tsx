"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listMembershipApplications,
  type MembershipApplication,
  type ApplicationStatus,
} from "@/lib/applications";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: Array<ApplicationStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MembershipApplicationsPage() {
  const [items, setItems] = useState<MembershipApplication[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listMembershipApplications({
      page,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotalPages(res.totalPages);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Membership Applications</h1>
          <p className="text-sm text-muted mt-1">
            Review and process applications submitted from the public site.
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              statusFilter === s
                ? "bg-amber-400 text-primary-dark shadow"
                : "bg-white border border-border text-muted hover:border-amber-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-border rounded-md p-16 text-center text-muted">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-border rounded-md p-16 text-center">
          <p className="text-muted">No applications found.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-border text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">House</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/50">
                  <td className="px-5 py-3 font-semibold text-primary-dark">
                    {a.fullName}
                    <div className="text-xs text-muted font-normal">{a.email}</div>
                  </td>
                  <td className="px-5 py-3">{a.phone}</td>
                  <td className="px-5 py-3 text-muted">
                    {a.houseNo}
                    {a.road && <span>, Rd {a.road}</span>}
                    {a.block && <span>, {a.block}</span>}
                  </td>
                  <td className="px-5 py-3 text-muted text-xs">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold ${STATUS_STYLES[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/applications/membership/${a.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-primary-dark hover:bg-primary text-white rounded text-xs font-bold uppercase tracking-wider"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[40px] h-10 grid place-items-center rounded-md text-sm font-semibold transition ${
                p === page
                  ? "bg-amber-400 text-primary-dark shadow-md"
                  : "bg-white border border-border hover:border-amber-400"
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
