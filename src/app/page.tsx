import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";
import Menu from "@/components/home/menu";
import Header from "@/components/layout/header";


export default async function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="container mx-auto mb-10">
        <Menu />
      </section>
      <Footer />
    </main>

  );
}
