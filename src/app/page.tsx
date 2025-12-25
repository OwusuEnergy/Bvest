import { Cta } from '@/components/sections/cta';
import { Features } from '@/components/sections/features';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <Cta />
    </>
  );
}
