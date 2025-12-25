import { Cta } from '@/components/sections/cta';
import { Features } from '@/components/sections/features';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Stats } from '@/components/sections/stats';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Cta />
    </>
  );
}
