"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, SITE_URL } from "@/lib/api";
import { NEWSROOM_CATEGORIES, type Article, type ArticleBlock } from "@/lib/types";
import { linesToList, listToLines, slugify } from "@/lib/format";
import { useToast } from "@/components/Toast";
import { ImageInput } from "@/components/ImageInput";
import { PageHeader, Spinner, Toggle } from "@/components/ui";

type Draft = Omit<Article, "id" | "display_date" | "created_at" | "updated_at">;

const BLOCK_LABEL: Record<ArticleBlock["type"], string> = {
  p: "Paragraph",
  h2: "Heading",
  list: "Bullet list",
  faq: "FAQ",
  image: "Image",
  gallery: "Gallery",
};

function newBlock(type: ArticleBlock["type"]): ArticleBlock {
  switch (type) {
    case "p":
    case "h2":
      return { type, text: "" };
    case "list":
      return { type, items: [] };
    case "faq":
      return { type, items: [{ q: "", a: "" }] };
    case "image":
      return { type, src: "", alt: "" };
    case "gallery":
      return { type, images: [] };
  }
}

function BlockFields({ block, onChange }: { block: ArticleBlock; onChange: (b: ArticleBlock) => void }) {
  switch (block.type) {
    case "p":
      return (
        <textarea
          className="field min-h-28"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Paragraph text"
        />
      );
    case "h2":
      return (
        <input
          className="field text-base font-semibold"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Section heading"
        />
      );
    case "list":
      return (
        <>
          <textarea
            className="field min-h-28"
            value={listToLines(block.items)}
            onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
            placeholder="One bullet per line"
          />
          <p className="mt-1 text-xs text-grey-600">One bullet point per line.</p>
        </>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((qa, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-grey-100 p-3">
              <div className="flex gap-2">
                <input
                  className="field font-semibold"
                  value={qa.q}
                  placeholder={`Question ${i + 1}`}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = { ...qa, q: e.target.value };
                    onChange({ ...block, items });
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary px-3"
                  aria-label="Remove question"
                  onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </div>
              <textarea
                className="field min-h-20"
                value={qa.a}
                placeholder="Answer"
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...qa, a: e.target.value };
                  onChange({ ...block, items });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onChange({ ...block, items: [...block.items, { q: "", a: "" }] })}
          >
            + Add question
          </button>
        </div>
      );
    case "image":
      return (
        <div className="space-y-3">
          <ImageInput value={block.src} onChange={(src) => onChange({ ...block, src })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" value={block.alt} placeholder="Alt text (describe the image)" onChange={(e) => onChange({ ...block, alt: e.target.value })} />
            <input className="field" value={block.caption ?? ""} placeholder="Caption (optional)" onChange={(e) => onChange({ ...block, caption: e.target.value })} />
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="space-y-3">
          {block.images.map((img, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-grey-100 p-3">
              <ImageInput
                label={`Image ${i + 1}`}
                value={img.src}
                onChange={(src) => {
                  const images = [...block.images];
                  images[i] = { ...img, src };
                  onChange({ ...block, images });
                }}
              />
              <div className="flex gap-2">
                <input
                  className="field"
                  value={img.alt}
                  placeholder="Alt text"
                  onChange={(e) => {
                    const images = [...block.images];
                    images[i] = { ...img, alt: e.target.value };
                    onChange({ ...block, images });
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary px-3"
                  aria-label="Remove image"
                  onClick={() => onChange({ ...block, images: block.images.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onChange({ ...block, images: [...block.images, { src: "", alt: "" }] })}
          >
            + Add image
          </button>
        </div>
      );
  }
}

/** Drops empty list lines before saving (the textarea keeps them while typing). */
function tidyBody(body: ArticleBlock[]): ArticleBlock[] {
  return body.map((b) => (b.type === "list" ? { ...b, items: linesToList(b.items.join("\n")) } : b));
}

export function ArticleEditor({ initial }: { initial?: Article }) {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<Draft>(
    initial ?? {
      slug: "",
      title: "",
      publish_date: new Date().toISOString().slice(0, 10),
      author: "ReBAT",
      category: NEWSROOM_CATEGORIES[0],
      excerpt: "",
      body: [{ type: "p", text: "" }],
      image: "",
      image_alt: "",
      is_published: true,
    },
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function setTitle(title: string) {
    setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
  }

  function updateBlock(i: number, block: ArticleBlock) {
    setDraft((d) => ({ ...d, body: d.body.map((b, j) => (j === i ? block : b)) }));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    setDraft((d) => {
      const body = [...d.body];
      const j = i + dir;
      if (j < 0 || j >= body.length) return d;
      [body[i], body[j]] = [body[j], body[i]];
      return { ...d, body };
    });
  }
  function removeBlock(i: number) {
    setDraft((d) => ({ ...d, body: d.body.filter((_, j) => j !== i) }));
  }
  function addBlock(type: ArticleBlock["type"]) {
    setDraft((d) => ({ ...d, body: [...d.body, newBlock(type)] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...draft, body: tidyBody(draft.body) };
    try {
      if (initial) {
        const saved = await api<Article>(`/articles/${initial.id}/`, { method: "PUT", body: payload });
        setDraft(saved);
        toast("Article saved");
      } else {
        const saved = await api<Article>("/articles/", { method: "POST", body: payload });
        toast("Article created");
        router.replace(`/articles/${saved.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial || !confirm(`Delete "${initial.title}"? It will disappear from the website.`)) return;
    try {
      await api(`/articles/${initial.id}/`, { method: "DELETE" });
      toast("Article deleted");
      router.replace("/articles");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title={initial ? "Edit article" : "New article"}
        actions={
          <>
            {initial?.is_published && (
              <a className="btn-secondary" href={`${SITE_URL}/newsroom/${initial.slug}`} target="_blank" rel="noopener noreferrer">
                View on website
              </a>
            )}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Spinner />}
              {initial ? "Save changes" : "Create article"}
            </button>
          </>
        }
      />

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card space-y-4 p-5">
            <div>
              <label className="label" htmlFor="title">
                Title
              </label>
              <input id="title" className="field text-base font-semibold" value={draft.title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="excerpt">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                className="field min-h-20"
                value={draft.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One or two sentences shown on the article card"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-ink">Article body</h2>
            {draft.body.map((block, i) => (
              <div key={i} className="card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-grey-600 uppercase">{BLOCK_LABEL[block.type]}</span>
                  <div className="flex gap-1">
                    <button type="button" className="rounded px-2 py-1 text-grey-600 hover:bg-grey-50 disabled:opacity-30" onClick={() => moveBlock(i, -1)} disabled={i === 0} aria-label="Move up">
                      ↑
                    </button>
                    <button type="button" className="rounded px-2 py-1 text-grey-600 hover:bg-grey-50 disabled:opacity-30" onClick={() => moveBlock(i, 1)} disabled={i === draft.body.length - 1} aria-label="Move down">
                      ↓
                    </button>
                    <button type="button" className="rounded px-2 py-1 text-red-700 hover:bg-red-50" onClick={() => removeBlock(i)} aria-label="Remove block">
                      ✕
                    </button>
                  </div>
                </div>
                <BlockFields block={block} onChange={(b) => updateBlock(i, b)} />
              </div>
            ))}
            <div className="card flex flex-wrap items-center gap-2 border-dashed p-3">
              <span className="mr-1 text-xs font-semibold text-grey-600">Add:</span>
              {(Object.keys(BLOCK_LABEL) as ArticleBlock["type"][]).map((type) => (
                <button key={type} type="button" className="btn-secondary px-3 py-1.5" onClick={() => addBlock(type)}>
                  + {BLOCK_LABEL[type]}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card space-y-4 p-5">
            <Toggle checked={draft.is_published} onChange={(v) => set("is_published", v)} label={draft.is_published ? "Published" : "Draft (hidden)"} />
            <div>
              <label className="label" htmlFor="category">
                Category
              </label>
              <select id="category" className="field" value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {NEWSROOM_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="date">
                Publish date
              </label>
              <input id="date" type="date" className="field" value={draft.publish_date} onChange={(e) => set("publish_date", e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="author">
                Author
              </label>
              <input id="author" className="field" value={draft.author} onChange={(e) => set("author", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                URL slug
              </label>
              <input
                id="slug"
                className="field font-mono text-xs"
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="generated-from-title"
              />
              <p className="mt-1 text-xs break-all text-grey-600">/newsroom/{draft.slug || "…"}</p>
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <ImageInput label="Cover image" value={draft.image} onChange={(v) => set("image", v)} />
            <div>
              <label className="label" htmlFor="alt">
                Cover image alt text
              </label>
              <input id="alt" className="field" value={draft.image_alt} onChange={(e) => set("image_alt", e.target.value)} />
            </div>
            <p className="text-xs text-grey-600">Without a cover image, the card uses the category&rsquo;s colour.</p>
          </section>

          {initial && (
            <button type="button" className="btn-danger w-full" onClick={handleDelete}>
              Delete article
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}
