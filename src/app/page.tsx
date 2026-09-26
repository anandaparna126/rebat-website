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
import { getPublishedArticles } from "@/lib/newsroomApi";

export default async function Home() {
  const articles = await getPublishedArticles();
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
