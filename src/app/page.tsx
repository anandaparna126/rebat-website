import { Footer } from "@/components/layout/Footer";
import { HeroTrack } from "@/components/hero/HeroTrack";
import { Description } from "@/components/description/Description";
import { ProcessLoop } from "@/components/loop/ProcessLoop";
import { Impact } from "@/components/impact/Impact";
import { RebatStorySection } from "@/components/story/RebatStorySection";
import { Products } from "@/components/products/Products";
import { Recognition } from "@/components/association/Recognition";
import { Newsroom } from "@/components/newsroom/Newsroom";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { getArticles } from "@/lib/api";

// Newsroom cards come from the backend; refetched at most every 30s.
export const revalidate = 30;

export default async function Home() {
  const articles = await getArticles();
  return (
    <>
      <HeroTrack />
      <main>
        <Description />
        <ProcessLoop />
        <Impact />
        <RebatStorySection />
        <Products variant="classic" />
        <Recognition />
        <Newsroom articles={articles} />
        <GetInTouch />
      </main>
      <Footer />
    </>
  );
}
