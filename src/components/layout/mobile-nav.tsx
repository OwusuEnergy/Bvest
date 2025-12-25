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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <Accordion type="single" collapsible className="w-full">
            {publicNavLinks.map((link) =>
              link.children ? (
                <AccordionItem value={link.name} key={link.name} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      "py-2 text-lg font-medium transition-colors hover:text-primary hover:no-underline",
                      link.children.some((child) => child.path === pathname)
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 pl-4">
                    <div className="flex flex-col space-y-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'text-base font-medium transition-colors hover:text-primary',
                            pathname === child.path
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <Link
                  key={link.path}
                  href={link.path!}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'py-2 text-lg font-medium transition-colors hover:text-primary',
                    pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </Accordion>
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
