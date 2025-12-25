import { Cta } from '@/components/sections/cta';
import { Features } from '@/components/sections/features';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
