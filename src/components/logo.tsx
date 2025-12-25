import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  isLink?: boolean;
};

export function Logo({ className, isLink = true }: LogoProps) {
  const content = (
    <div className={cn('flex items-center gap-2 text-primary', className)}>
      <div className="rounded-full bg-primary p-2 text-primary-foreground">
        <Car className="h-6 w-6" />
      </div>
      <span className="text-2xl font-bold font-headline text-foreground">
        CarVest
      </span>
    </div>
  );

  if (isLink) {
    return <Link href="/">{content}</Link>;
  }

  return content;
}
