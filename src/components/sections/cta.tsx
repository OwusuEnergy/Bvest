import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authLinks } from '@/lib/constants';

export function Cta() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <div className="rounded-2xl bg-primary/90 p-8 text-center shadow-lg md:p-12 animate-fade-in-up">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Start Earning?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Create your account in minutes and make your first investment today.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild className="animate-fade-in" style={{animationDelay: '0.5s'}}>
              <Link href={authLinks.signup}>Join BVest Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
