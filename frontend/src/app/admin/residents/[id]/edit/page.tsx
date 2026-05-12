"use client";

import { use, useEffect, useState } from "react";
import { ResidentForm } from "@/components/admin/ResidentForm";
import { adminGetResident, type Resident } from "@/lib/residents";

export default function EditResidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<Resident | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetResident(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="text-danger">Failed: {error}</div>;
  if (!item) return <div className="text-muted">Loading...</div>;

  return <ResidentForm initial={item} />;
}
