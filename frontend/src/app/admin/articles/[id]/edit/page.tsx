"use client";

import { use, useEffect, useState } from "react";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { adminGetArticle, type Article } from "@/lib/articles";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetArticle(id)
      .then(setArticle)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) {
    return (
      <div className="px-4 py-8 text-danger">
        Failed to load article: {error}
      </div>
    );
  }

  if (!article) {
    return <div className="px-4 py-8 text-muted">Loading...</div>;
  }

  return <ArticleForm initial={article} />;
}
