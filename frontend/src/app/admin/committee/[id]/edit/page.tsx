"use client";

import { use, useEffect, useState } from "react";
import { CommitteeMemberForm } from "@/components/admin/CommitteeMemberForm";
import { adminGetCommitteeMember, type CommitteeMember } from "@/lib/committee";

export default function EditCommitteeMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<CommitteeMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetCommitteeMember(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="text-danger">Failed: {error}</div>;
  if (!item) return <div className="text-muted">Loading...</div>;

  return <CommitteeMemberForm initial={item} />;
}
