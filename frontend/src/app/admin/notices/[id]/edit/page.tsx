"use client";

import { use, useEffect, useState } from "react";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { adminGetNotice, type NoticeDetail } from "@/lib/notices";

export default function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetNotice(id)
      .then(setNotice)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) return <div className="px-4 py-8 text-danger">Failed to load: {error}</div>;
  if (!notice) return <div className="px-4 py-8 text-muted">Loading...</div>;

  return <NoticeForm initial={notice} />;
}
