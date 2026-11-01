import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";
import HomeHighlights from "@/components/home/highlights";
import Menu from "@/components/home/menu";
import Header from "@/components/layout/header";
import type { SearchParams } from "@/components/search/searchInput";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <main>
      <Header />
      <Hero />
      <HomeHighlights />
      <Menu searchParams={params} />
      <Footer />
    </main>

  );
}
