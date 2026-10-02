"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, SITE_URL } from "@/lib/api";
import { NEWSROOM_CATEGORIES, type Article, type Paginated } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { previewUrl } from "@/components/ImageInput";
import { EmptyState, ErrorState, Loading, PageHeader, Pagination, Pill } from "@/components/ui";

export default function ArticlesPage() {
  const [data, setData] = useState<Paginated<Article> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setError(null);
    const qs = new URLSearchParams({ page: String(page), page_size: "20" });
    if (category) qs.set("category", category);
    if (status) qs.set("status", status);
    if (q) qs.set("q", q);
    api<Paginated<Article>>(`/articles/?${qs}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [category, status, q, page]);

  useEffect(load, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <PageHeader
        title="Newsroom"
        description="Articles shown on the website's homepage and /newsroom. Changes go live within about 30 seconds."
        actions={
          <Link href="/articles/new" className="btn-primary">
            + New article
          </Link>
        }
      />

      <div className="card mb-4 flex flex-wrap gap-3 p-3">
        <select
          className="field w-auto"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {NEWSROOM_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className="field w-auto"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="">Published & drafts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <input
          className="field min-w-52 flex-1"
          placeholder="Search titles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search articles"
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <Loading />
      ) : data.results.length === 0 ? (
        <EmptyState title="No articles found">
          <Link href="/articles/new" className="text-brand">
            Write the first one →
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="card divide-y divide-grey-100">
            {data.results.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-grey-100">
                  {a.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl(a.image)} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/articles/${a.id}`} className="line-clamp-1 font-semibold text-ink hover:text-brand">
                    {a.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-grey-600">
                    <span>{a.category}</span>
                    <span>·</span>
                    <span>{formatDate(a.publish_date)}</span>
                    <Pill on={a.is_published}>{a.is_published ? "Published" : "Draft"}</Pill>
                  </div>
                </div>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  {a.is_published && (
                    <a className="btn-secondary" href={`${SITE_URL}/newsroom/${a.slug}`} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  )}
                  <Link className="btn-secondary" href={`/articles/${a.id}`}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={data.page} numPages={data.num_pages} count={data.count} onChange={setPage} />
        </>
      )}
    </>
  );
}
