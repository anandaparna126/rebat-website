import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { PageShell } from "@/components/layout/PageShell";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { CATEGORY_STYLE, getReadingTime } from "@/lib/newsroom";
import { getArticle, getArticles } from "@/lib/api";

// Articles come from the backend, so any slug published from the admin
// panel renders on first visit; refetched at most every 30s.
export const revalidate = 30;

export default async function NewsroomArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, all] = await Promise.all([getArticle(slug), getArticles()]);
  if (!article) notFound();

  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3);

  const style = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Blogs;

  return (
    <PageShell hideNav>
      {/* Always the category's own colour, not the article's real photo —
          a photo dimmed enough to sit text on top of stops being a photo
          you can actually see. The real photo instead gets its own
          undimmed thumbnail spot just below, at full visibility. */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-[5vw] pt-[168px] pb-16"
        style={{ background: style.gradient }}
      >
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
            <span>{article.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>By {article.author}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{getReadingTime(article)} min read</span>
          </p>
        </div>
      </section>

      <section className="bg-white px-[5vw] pt-12">
        <div className="mx-auto max-w-[860px]">
          {article.image && (
            <Reveal>
              <figure className="relative aspect-video w-full overflow-hidden rounded-2xl bg-grey-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.imageAlt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
              </figure>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                >
                  View original post on LinkedIn
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-white px-[5vw] pb-20">
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
              if (block.type === "image") {
                return (
                  <figure key={i}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-grey-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.src} alt={block.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    {block.caption && <figcaption className="mt-2 text-xs text-grey-500">{block.caption}</figcaption>}
                  </figure>
                );
              }
              if (block.type === "gallery") {
                return (
                  <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {block.images.map((img, j) => (
                      <figure key={j} className="relative aspect-square overflow-hidden rounded-xl bg-grey-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      </figure>
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
              const light = Boolean(a.image) || relatedStyle.light;
              return (
                <Reveal key={a.slug} delay={i * 0.05}>
                  <Link
                    href={`/newsroom/${a.slug}`}
                    className="group relative block h-full overflow-hidden rounded-2xl p-5 transition-transform duration-300 ease-out hover:-translate-y-1"
                    style={a.image ? undefined : { background: relatedStyle.gradient }}
                  >
                    {a.image && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.6) 0%, rgba(10,20,18,0.88) 100%)" }} />
                      </>
                    )}
                    <div className="relative">
                      <div className={`text-xs ${light ? "text-white/60" : "text-ink/50"}`}>{a.date}</div>
                      <h4 className={`mt-1.5 text-sm leading-snug font-bold ${light ? "text-white" : "text-ink"}`}>{a.title}</h4>
                    </div>
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
