"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getAdoptionRequest,
  updateAdoptionStatus,
  type AdoptionRequest,
  type ApplicationStatus,
} from "@/lib/applications";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { formatDate } from "@/lib/utils";

export default function AdoptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<AdoptionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItem(await getAdoptionRequest(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpdate(status: ApplicationStatus, note?: string) {
    await updateAdoptionStatus(id, status, note);
    await load();
  }

  if (error) return <div className="text-danger">Failed to load: {error}</div>;
  if (!item) return <div className="text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/applications/adoptions"
          className="text-sm text-muted hover:text-primary"
        >
          ← Back to adoptions
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
          <div>
            <h1 className="text-3xl font-bold text-primary">{item.applicantName}</h1>
            <p className="text-muted text-sm mt-1">
              {item.target === "ROAD" ? "🛣 Road" : "🚪 Gate"} adoption ·
              Submitted {formatDate(item.createdAt)}
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-semibold text-primary uppercase border-b border-border pb-2">
            Applicant
          </h3>
          <DetailRow label="Name" value={item.applicantName} />
          {item.organization && <DetailRow label="Organization" value={item.organization} />}
          <DetailRow label="Email" value={item.email} />
          <DetailRow label="Phone" value={item.phone} />

          <h3 className="text-xs font-semibold text-primary uppercase border-b border-border pb-2 pt-4">
            Adoption Target
          </h3>
          <DetailRow label="Type" value={item.target} />
          <DetailRow label="Location" value={item.locationRef} />

          {item.message && (
            <>
              <h3 className="text-xs font-semibold text-primary uppercase border-b border-border pb-2 pt-4">
                Message
              </h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                {item.message}
              </p>
            </>
          )}

          {item.adminNote && (
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="text-xs font-semibold text-primary uppercase mb-2">
                Admin Note
              </h4>
              <p className="text-sm text-foreground/80 bg-cream p-3 rounded">
                {item.adminNote}
              </p>
            </div>
          )}
        </div>

        <div>
          <StatusActions current={item.status} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid sm:grid-cols-3 gap-2 text-sm">
      <div className="text-muted">{label}</div>
      <div className="sm:col-span-2 font-medium text-foreground">{value}</div>
    </div>
  );
}
