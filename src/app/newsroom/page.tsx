import { PageShell } from "@/components/layout/PageShell";
import { NewsroomBrowser } from "@/components/newsroom/NewsroomBrowser";
import { getPublishedArticles } from "@/lib/newsroomApi";

export default async function Newsroom() {
  const articles = await getPublishedArticles();
  return (
    <PageShell hideNav>
      <NewsroomBrowser articles={articles} />
    </PageShell>
  );
}
