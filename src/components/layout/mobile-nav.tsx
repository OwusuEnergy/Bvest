'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { authLinks, publicNavLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '../logo';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <Logo />
        <div className="mt-8 flex flex-col space-y-4">
          {publicNavLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary',
                pathname === link.path ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col space-y-2">
            <Button variant="outline" asChild>
              <Link href={authLinks.login}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href={authLinks.signup}>Create Account</Link>
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
