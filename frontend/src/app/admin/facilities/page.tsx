"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListFacilities,
  toggleFacilityActive,
  deleteFacility,
  CATEGORY_META,
  ALL_CATEGORIES,
  type Facility,
  type FacilityCategory,
} from "@/lib/facilities";

export default function AdminFacilitiesPage() {
  const [items, setItems] = useState<Facility[]>([]);
  const [filter, setFilter] = useState<FacilityCategory | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListFacilities(filter || undefined));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function onToggle(id: string) {
    try {
      await toggleFacilityActive(id);
      load();
    } catch (e) {
      alert(`Toggle failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteFacility(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  // Group items by category for display
  const grouped: Record<FacilityCategory, Facility[]> = {} as Record<FacilityCategory, Facility[]>;
  ALL_CATEGORIES.forEach((c) => (grouped[c] = []));
  items.forEach((it) => grouped[it.category].push(it));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Facilities</h1>
          <p className="text-muted text-sm mt-1">
            {items.length} {items.length === 1 ? "facility" : "facilities"}{" "}
            {filter ? `in ${CATEGORY_META[filter].label}` : "across all categories"}
          </p>
        </div>
        <Link
          href="/admin/facilities/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Facility
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            !filter ? "bg-primary text-white" : "bg-surface border border-border"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm transition inline-flex items-center gap-1.5 ${
              filter === c ? "bg-primary text-white" : "bg-surface border border-border"
            }`}
          >
            <span>{CATEGORY_META[c].icon}</span>
            <span>{CATEGORY_META[c].label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <p className="text-muted">No facilities yet.</p>
          <Link
            href="/admin/facilities/new"
            className="inline-block mt-3 text-secondary underline text-sm"
          >
            Add your first facility
          </Link>
        </div>
      ) : (
        ALL_CATEGORIES.map((category) => {
          const list = grouped[category];
          if (list.length === 0) return null;
          const meta = CATEGORY_META[category];
          return (
            <div
              key={category}
              className="bg-surface border border-border rounded-lg overflow-hidden"
            >
              <div className="bg-cream px-4 py-2.5 border-b border-border flex items-center gap-2">
                <span>{meta.icon}</span>
                <span className="text-sm font-semibold text-primary">
                  {meta.label}
                </span>
                <span className="text-xs text-muted">({list.length})</span>
              </div>
              <table className="w-full">
                <tbody>
                  {list.map((f) => (
                    <tr
                      key={f.id}
                      className={`border-t border-border first:border-0 hover:bg-cream/30 ${
                        !f.isActive ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/facilities/${f.id}/edit`}
                          className="font-semibold text-primary hover:text-secondary"
                        >
                          {f.name}
                        </Link>
                        {f.address && (
                          <div className="text-xs text-muted">{f.address}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                        {f.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-1 justify-end items-center">
                          <button
                            onClick={() => onToggle(f.id)}
                            title={f.isActive ? "Deactivate" : "Activate"}
                            className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded font-semibold ${
                              f.isActive
                                ? "bg-success/15 text-success"
                                : "bg-muted/20 text-muted"
                            }`}
                          >
                            {f.isActive ? "Active" : "Hidden"}
                          </button>
                          <Link
                            href={`/admin/facilities/${f.id}/edit`}
                            className="px-2 py-1 text-xs text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => onDelete(f.id, f.name)}
                            className="px-2 py-1 text-xs text-danger hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}
