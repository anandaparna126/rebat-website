import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { PageShell } from "@/components/layout/PageShell";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { CATEGORY_STYLE, formatArticleDate, getReadingTime } from "@/lib/newsroom";
import { getPublishedArticle, getPublishedArticles } from "@/lib/newsroomApi";

// Posts are managed live from /admin (see NewsroomPanel.tsx), so this page
// renders per-request rather than at build time — a newly published or
// edited post must show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function NewsroomArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const all = await getPublishedArticles();
  const related = all
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const style = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Blogs;

  return (
    <PageShell hideNav>
      {/* No real photography exists for this article (rebat.in's own blog
          images are broken site-wide, verified directly — see newsroom.ts),
          so the header is the category's own colour instead of a stand-in
          photo. A dark wash is layered on top regardless of the category's
          own light/dark tone, so the nav's white starting text always has
          somewhere safe to sit — the tinted cards on the listing page can
          be light, but this header never is. */}
      <section className="relative overflow-hidden px-[5vw] pt-[168px] pb-20" style={{ background: style.gradient }}>
        <Nav />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.35) 0%, rgba(10,20,18,0.55) 100%)" }}
        />
        <Grain opacity={0.06} />
        <div className="relative mx-auto max-w-[860px]">
          <div className="mb-4 flex items-center gap-2.5 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {article.category}
          </div>
          <h1 className="text-4xl leading-[1.15] font-bold text-white sm:text-5xl">{article.title}</h1>
          <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>By {article.author}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{getReadingTime(article)} min read</span>
          </p>
        </div>
      </section>

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto max-w-[720px]">
          <div className="space-y-6 text-base leading-relaxed text-grey-700">
            {article.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="pt-4 text-2xl font-bold text-ink first:pt-0">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "p") {
                return <p key={i}>{block.text}</p>;
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="space-y-2.5 border-l-2 border-grey-200 pl-5">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "faq") {
                return (
                  <div key={i} className="space-y-5 rounded-2xl bg-grey-50 p-6 sm:p-7">
                    {block.items.map((qa, j) => (
                      <div key={j}>
                        <h4 className="font-bold text-ink">{qa.q}</h4>
                        <p className="mt-1.5 text-sm text-grey-600">{qa.a}</p>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>

          <Link href="/newsroom" className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
            <span aria-hidden="true">&larr;</span> Back to Newsroom
          </Link>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="bg-grey-50 px-[5vw] py-20">
          <Reveal className="mx-auto mb-10 max-w-[860px]">
            <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">More from Newsroom</div>
          </Reveal>
          <div className="mx-auto grid max-w-[860px] grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((a, i) => {
              const relatedStyle = CATEGORY_STYLE[a.category] ?? CATEGORY_STYLE.Blogs;
              return (
                <Reveal key={a.slug} delay={i * 0.05}>
                  <Link
                    href={`/newsroom/${a.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl p-5 transition-transform duration-300 ease-out hover:-translate-y-1"
                    style={{ background: relatedStyle.gradient }}
                  >
                    <div className={`text-xs ${relatedStyle.light ? "text-white/60" : "text-ink/50"}`}>{formatArticleDate(a.publishedAt)}</div>
                    <h4 className={`mt-1.5 text-sm leading-snug font-bold ${relatedStyle.light ? "text-white" : "text-ink"}`}>{a.title}</h4>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <GetInTouch />
    </PageShell>
  );
}
