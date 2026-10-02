"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Article } from "@/lib/types";
import { ArticleEditor } from "@/components/ArticleEditor";
import { ErrorState, Loading } from "@/components/ui";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Article>(`/articles/${id}/`)
      .then(setArticle)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!article) return <Loading />;
  return <ArticleEditor key={article.id} initial={article} />;
}
