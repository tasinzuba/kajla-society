"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@/lib/applications";

type Props = {
  current: ApplicationStatus;
  onUpdate: (status: ApplicationStatus, note?: string) => Promise<void>;
};

export function StatusActions({ current, onUpdate }: Props) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(status: ApplicationStatus) {
    setSubmitting(status);
    setError(null);
    try {
      await onUpdate(status, note.trim() || undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-xs font-semibold text-primary uppercase">
        Update Status
      </h3>
      <div className="text-sm">
        Current: <span className="font-semibold text-primary">{current}</span>
      </div>

      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:outline-none focus:border-secondary"
        placeholder="Note for applicant (optional, included in email)"
      />

      {error && <div className="text-xs text-danger">{error}</div>}

      <div className="flex gap-2">
        <button
          disabled={submitting !== null || current === "APPROVED"}
          onClick={() => update("APPROVED")}
          className="flex-1 py-2 bg-success text-white rounded text-sm font-semibold hover:opacity-90 disabled:opacity-40"
        >
          {submitting === "APPROVED" ? "..." : "✓ Approve"}
        </button>
        <button
          disabled={submitting !== null || current === "REJECTED"}
          onClick={() => update("REJECTED")}
          className="flex-1 py-2 bg-danger text-white rounded text-sm font-semibold hover:opacity-90 disabled:opacity-40"
        >
          {submitting === "REJECTED" ? "..." : "✗ Reject"}
        </button>
        {current !== "PENDING" && (
          <button
            disabled={submitting !== null}
            onClick={() => update("PENDING")}
            className="px-3 py-2 border border-border rounded text-sm hover:bg-cream"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
