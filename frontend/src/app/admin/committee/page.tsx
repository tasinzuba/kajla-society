"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  adminListCommittee,
  toggleCommitteeActive,
  deleteCommitteeMember,
  type CommitteeMember,
} from "@/lib/committee";
import { mediaUrl } from "@/lib/media";

export default function AdminCommitteePage() {
  const [items, setItems] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListCommittee());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onToggle(id: string) {
    try {
      await toggleCommitteeActive(id);
      load();
    } catch (e) {
      alert(`Failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteCommitteeMember(id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  // Group by term
  const grouped: Record<string, CommitteeMember[]> = {};
  items.forEach((m) => {
    if (!grouped[m.term]) grouped[m.term] = [];
    grouped[m.term].push(m);
  });
  const terms = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Member Directory</h1>
          <p className="text-muted text-sm mt-1">
            {items.length} committee {items.length === 1 ? "member" : "members"} across{" "}
            {terms.length} {terms.length === 1 ? "term" : "terms"}
          </p>
        </div>
        <Link
          href="/admin/committee/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
        >
          + New Member
        </Link>
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
          <p className="text-muted">No committee members yet.</p>
          <Link
            href="/admin/committee/new"
            className="inline-block mt-3 text-secondary underline text-sm"
          >
            Add the first member
          </Link>
        </div>
      ) : (
        terms.map((term, idx) => (
          <div
            key={term}
            className="bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="bg-cream px-4 py-2.5 border-b border-border flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">
                Term {term}
              </span>
              {idx === 0 && (
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-success/15 text-success rounded font-semibold">
                  Current
                </span>
              )}
              <span className="text-xs text-muted ml-auto">
                {grouped[term].length} {grouped[term].length === 1 ? "member" : "members"}
              </span>
            </div>
            <table className="w-full">
              <tbody>
                {grouped[term].map((m) => (
                  <tr
                    key={m.id}
                    className={`border-t border-border first:border-0 hover:bg-cream/30 ${
                      !m.isActive ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 w-12">
                      <div className="w-10 h-10 rounded-full bg-cream overflow-hidden">
                        {m.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaUrl(m.photo) ?? ""}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-secondary font-bold">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/committee/${m.id}/edit`}
                        className="font-semibold text-primary hover:text-secondary"
                      >
                        {m.name}
                      </Link>
                      <div className="text-xs text-muted">{m.role}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted hidden md:table-cell">
                      {m.phone || m.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted hidden md:table-cell">
                      #{m.order}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end items-center">
                        <button
                          onClick={() => onToggle(m.id)}
                          className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded font-semibold ${
                            m.isActive
                              ? "bg-success/15 text-success"
                              : "bg-muted/20 text-muted"
                          }`}
                        >
                          {m.isActive ? "Active" : "Hidden"}
                        </button>
                        <Link
                          href={`/admin/committee/${m.id}/edit`}
                          className="px-2 py-1 text-xs text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(m.id, m.name)}
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
        ))
      )}
    </div>
  );
}
