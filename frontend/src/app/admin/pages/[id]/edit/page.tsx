"use client";

import { use, useEffect, useState } from "react";
import { PageForm } from "@/components/admin/PageForm";
import { adminGetPage, type Page } from "@/lib/pages";

export default function EditPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetPage(id)
      .then(setPage)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="text-danger">Failed to load: {error}</div>;
  if (!page) return <div className="text-muted">Loading...</div>;

  return <PageForm initial={page} />;
}
