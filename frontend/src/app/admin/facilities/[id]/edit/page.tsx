"use client";

import { use, useEffect, useState } from "react";
import { FacilityForm } from "@/components/admin/FacilityForm";
import { adminGetFacility, type Facility } from "@/lib/facilities";

export default function EditFacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<Facility | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetFacility(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="text-danger">Failed to load: {error}</div>;
  if (!item) return <div className="text-muted">Loading...</div>;

  return <FacilityForm initial={item} />;
}
