import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authLinks } from '@/lib/constants';

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover animate-fade-in"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      <div className="container relative z-10 flex h-full items-center">
        <div className="max-w-2xl text-left animate-fade-in-up">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Drive Your Wealth.
            <br />
            <span className="text-primary">Invest in Cars.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join CarVest and turn cars into a profitable investment. Earn daily returns, track your portfolio, and watch your wealth grow on autopilot.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link href={authLinks.signup}>Get Started</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link href="/how-it-works">Learn More &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
