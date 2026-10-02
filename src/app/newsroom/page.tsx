import { NewsroomIndex } from "@/components/newsroom/NewsroomIndex";
import { getArticles } from "@/lib/api";

// Articles come from the backend (managed in the admin panel); refetched at
// most every 30s.
export const revalidate = 30;

export default async function Newsroom() {
  const articles = await getArticles();
  return <NewsroomIndex articles={articles} />;
}
