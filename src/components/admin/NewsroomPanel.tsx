"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NEWSROOM_CATEGORIES } from "@/lib/content";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] };

type Status = "draft" | "scheduled" | "published";

interface PostSummary {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: Status;
  publish_at: string | null;
  updated_at: string;
}

interface PostDetail extends PostSummary {
  author: string;
  excerpt: string;
  body: Block[];
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const STATUS_LABEL: Record<Status, string> = { draft: "Draft", scheduled: "Scheduled", published: "Published" };
const STATUS_COLOR: Record<Status, string> = { draft: "var(--grey-400)", scheduled: "var(--gold)", published: "var(--brand)" };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Datetime-local input wants "YYYY-MM-DDTHH:mm" in local time, with no
// timezone suffix — new Date(iso) + toISOString gives UTC, so this
// re-reads the browser-local wall-clock fields instead of slicing the
// ISO string, or a scheduled time would silently shift by the viewer's
// UTC offset every time the form re-opens.
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyDraft = (): Omit<PostDetail, "id" | "updated_at"> => ({
  title: "",
  slug: "",
  category: NEWSROOM_CATEGORIES[0],
  author: "Admin",
  excerpt: "",
  body: [{ type: "p", text: "" }],
  status: "draft",
  publish_at: null,
});

function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (b: Block[]) => void }) {
  function update(i: number, block: Block) {
    onChange(blocks.map((b, idx) => (idx === i ? block : b)));
  }
  function remove(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add(type: Block["type"]) {
    const block: Block =
      type === "p" ? { type: "p", text: "" }
      : type === "h2" ? { type: "h2", text: "" }
      : type === "list" ? { type: "list", items: [""] }
      : { type: "faq", items: [{ q: "", a: "" }] };
    onChange([...blocks, block]);
  }

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => (
        <div key={i} className="rounded-xl border border-grey-200 bg-grey-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">
              {block.type === "p" && "Paragraph"}
              {block.type === "h2" && "Heading"}
              {block.type === "list" && "Bullet list"}
              {block.type === "faq" && "FAQ"}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1.5 text-xs text-grey-600 hover:text-brand disabled:opacity-30">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="rounded px-1.5 text-xs text-grey-600 hover:text-brand disabled:opacity-30">↓</button>
              <button type="button" onClick={() => remove(i)} className="rounded px-1.5 text-xs text-red-600 hover:underline">Remove</button>
            </div>
          </div>

          {(block.type === "p" || block.type === "h2") && (
            <textarea
              value={block.text}
              onChange={(e) => update(i, { ...block, text: e.target.value })}
              rows={block.type === "h2" ? 1 : 3}
              placeholder={block.type === "h2" ? "Heading text" : "Paragraph text"}
              className="w-full resize-y rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          )}

          {block.type === "list" && (
            <div className="flex flex-col gap-2">
              {block.items.map((item, j) => (
                <div key={j} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => {
                      const items = block.items.map((it, idx) => (idx === j ? e.target.value : it));
                      update(i, { ...block, items });
                    }}
                    placeholder="List item"
                    className="flex-1 rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => update(i, { ...block, items: block.items.filter((_, idx) => idx !== j) })}
                    className="px-2 text-xs text-red-600 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(i, { ...block, items: [...block.items, ""] })}
                className="w-fit text-xs font-medium text-brand hover:underline"
              >
                + Add item
              </button>
            </div>
          )}

          {block.type === "faq" && (
            <div className="flex flex-col gap-3">
              {block.items.map((qa, j) => (
                <div key={j} className="rounded-lg border border-grey-200 bg-white p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-grey-500 uppercase">Q&amp;A {j + 1}</span>
                    <button
                      type="button"
                      onClick={() => update(i, { ...block, items: block.items.filter((_, idx) => idx !== j) })}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    value={qa.q}
                    onChange={(e) => {
                      const items = block.items.map((it, idx) => (idx === j ? { ...it, q: e.target.value } : it));
                      update(i, { ...block, items });
                    }}
                    placeholder="Question"
                    className="mb-2 w-full rounded-lg border border-grey-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  />
                  <textarea
                    value={qa.a}
                    onChange={(e) => {
                      const items = block.items.map((it, idx) => (idx === j ? { ...it, a: e.target.value } : it));
                      update(i, { ...block, items });
                    }}
                    rows={2}
                    placeholder="Answer"
                    className="w-full resize-y rounded-lg border border-grey-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(i, { ...block, items: [...block.items, { q: "", a: "" }] })}
                className="w-fit text-xs font-medium text-brand hover:underline"
              >
                + Add question
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(["p", "h2", "list", "faq"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => add(t)}
            className="rounded-full border border-grey-200 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-brand"
          >
            + {t === "p" ? "Paragraph" : t === "h2" ? "Heading" : t === "list" ? "Bullet list" : "FAQ"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NewsroomPanel() {
  const [view, setView] = useState<"list" | "edit">("list");
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Omit<PostDetail, "id" | "updated_at">>(emptyDraft());
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const loadedIdRef = useRef<number | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setLoadError(json?.error || "Could not load posts.");
        return;
      }
      setPosts(json.posts || []);
    } catch {
      setLoadError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function startNew() {
    setEditingId(null);
    setDraft(emptyDraft());
    setSlugTouched(false);
    setSaveError("");
    setView("edit");
  }

  async function startEdit(id: number) {
    setEditingId(id);
    setSlugTouched(true);
    setSaveError("");
    setView("edit");
    loadedIdRef.current = null;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setSaveError(json?.error || "Could not load this post.");
        return;
      }
      setDraft({
        title: json.title,
        slug: json.slug,
        category: json.category || NEWSROOM_CATEGORIES[0],
        author: json.author || "",
        excerpt: json.excerpt || "",
        body: json.body?.length ? json.body : [{ type: "p", text: "" }],
        status: json.status,
        publish_at: json.publish_at,
      });
      loadedIdRef.current = id;
    } catch {
      setSaveError("Could not reach the server. Please try again.");
    }
  }

  function backToList() {
    setView("list");
    loadPosts();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) {
      setSaveError("Enter a title.");
      return;
    }
    if (draft.status === "scheduled" && !draft.publish_at) {
      setSaveError("Pick a date and time to schedule this post for.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const path = editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts";
      const res = await fetch(path, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setSaveError(json?.error || "Could not save the post.");
        return;
      }
      backToList();
    } catch {
      setSaveError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    if (!confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${editingId}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setSaveError(json?.error || "Could not delete the post.");
        return;
      }
      backToList();
    } catch {
      setSaveError("Could not reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (view === "edit") {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <button type="button" onClick={backToList} className="text-sm font-medium text-grey-600 hover:text-brand">
            &larr; Back to posts
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-medium text-red-600 hover:border-red-400 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete post"}
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="rounded-2xl border border-grey-200 bg-white p-5">
            <label className="mb-1 block text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Title</label>
            <input
              value={draft.title}
              onChange={(e) => {
                const title = e.target.value;
                setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
              }}
              placeholder="Article title"
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />

            <label className="mt-4 mb-1 block text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">
              URL slug — /newsroom/{draft.slug || "…"}
            </label>
            <input
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setDraft((d) => ({ ...d, slug: slugify(e.target.value) }));
              }}
              placeholder="auto-generated-from-title"
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Category</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className="w-full rounded-lg border border-grey-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                >
                  {NEWSROOM_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Author</label>
                <input
                  value={draft.author}
                  onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
                  placeholder="Admin"
                  className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                />
              </div>
            </div>

            <label className="mt-4 mb-1 block text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Excerpt</label>
            <textarea
              value={draft.excerpt}
              onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              rows={2}
              placeholder="Short summary shown on the newsroom listing card"
              className="w-full resize-y rounded-lg border border-grey-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-5">
            <p className="mb-3 text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Article content</p>
            <BlockEditor blocks={draft.body} onChange={(body) => setDraft((d) => ({ ...d, body }))} />
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-5">
            <p className="mb-3 text-xs font-medium tracking-[0.06em] text-grey-600 uppercase">Publishing</p>
            <div className="flex flex-wrap gap-4">
              {(["draft", "published", "scheduled"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="status"
                    checked={draft.status === s}
                    onChange={() => setDraft((d) => ({ ...d, status: s }))}
                    className="accent-brand"
                  />
                  {s === "draft" ? "Save as draft" : s === "published" ? "Publish now" : "Schedule for later"}
                </label>
              ))}
            </div>
            {draft.status === "scheduled" && (
              <input
                type="datetime-local"
                value={toDatetimeLocal(draft.publish_at)}
                onChange={(e) => setDraft((d) => ({ ...d, publish_at: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                className="mt-3 rounded-lg border border-grey-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            )}
          </div>

          {saveError && <p className="text-sm text-red-600" role="alert">{saveError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Create post"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-ink">Newsroom</h1>
          <p className="text-xs text-grey-600">{posts.length} {posts.length === 1 ? "post" : "posts"} total</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadPosts}
            disabled={loading}
            className="rounded-full border border-grey-200 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={startNew}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            + New post
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>
      )}

      {!loadError && !loading && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-grey-200 bg-white p-10 text-center text-sm text-grey-600">
          No posts yet — click &ldquo;New post&rdquo; to write the first one.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {posts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => startEdit(p.id)}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-grey-200 bg-white p-4 text-left transition-colors hover:border-brand"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{p.title || "Untitled"}</p>
              <p className="mt-0.5 text-xs text-grey-600">{p.category || "Uncategorised"}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-grey-600">
              <span>{p.publish_at ? dateFormatter.format(new Date(p.publish_at)) : "—"}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium" style={{ background: "var(--grey-50)", color: "var(--ink)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[p.status] }} />
                {STATUS_LABEL[p.status]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
