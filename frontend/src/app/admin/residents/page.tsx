"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListResidents,
  toggleResidentVerified,
  deleteResident,
  type Resident,
} from "@/lib/residents";
import { mediaUrl } from "@/lib/media";

export default function AdminResidentsPage() {
  const [items, setItems] = useState<Resident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [verified, setVerified] = useState<"all" | "yes" | "no">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListResidents({
        page,
        limit: 30,
        q: q || undefined,
        verified: verified === "yes" ? true : verified === "no" ? false : undefined,
      });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, q, verified]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function onToggleVerified(id: string) {
    try {
      await toggleResidentVerified(id);
      load();
    } catch (e) {
      alert(`Failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete resident "${name}"?`)) return;
    try {
      await deleteResident(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Residence Directory</h1>
          <p className="text-muted text-sm mt-1">
            {total} {total === 1 ? "resident" : "residents"} total
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/residents/import"
            className="px-4 py-2 border border-border rounded-lg hover:bg-cream transition text-sm font-semibold"
          >
            ⬆ Bulk Import
          </Link>
          <Link
            href="/admin/residents/new"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
          >
            + New Resident
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="🔍 Search by name, house, phone, email..."
          className="flex-1 min-w-[260px] px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:border-secondary"
        />
        {(["all", "yes", "no"] as const).map((v) => (
          <button
            key={v}
            onClick={() => {
              setPage(1);
              setVerified(v);
            }}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              verified === v
                ? "bg-primary text-white"
                : "bg-surface border border-border hover:border-secondary"
            }`}
          >
            {v === "all" ? "All" : v === "yes" ? "Verified" : "Unverified"}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-cream text-xs uppercase text-muted tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Resident</th>
              <th className="text-left px-4 py-3">Address</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Contact</th>
              <th className="text-center px-4 py-3">Verified</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Public</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  No residents found.
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cream overflow-hidden flex-shrink-0">
                        {r.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaUrl(r.photo) ?? ""}
                            alt={r.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-sm font-bold text-secondary">
                            {r.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/residents/${r.id}/edit`}
                          className="font-semibold text-primary hover:text-secondary"
                        >
                          {r.fullName}
                        </Link>
                        {r.membershipNo && (
                          <div className="text-xs text-muted">#{r.membershipNo}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    H#{r.houseNo}
                    {r.road && <span className="text-muted">, Rd {r.road}</span>}
                    {r.block && <span className="text-muted">, Blk {r.block}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted hidden md:table-cell">
                    {r.phone && <div>📞 {r.phone}</div>}
                    {r.email && <div className="truncate">✉️ {r.email}</div>}
                    {!r.phone && !r.email && "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleVerified(r.id)}
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold ${
                        r.isVerified
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {r.isVerified ? "✓ Verified" : "Pending"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-xs hidden md:table-cell">
                    {r.isPublic ? "Public" : <span className="text-muted">Hidden</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/admin/residents/${r.id}/edit`}
                        className="px-2 py-1 text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(r.id, r.fullName)}
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
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded ${
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
  );
}
