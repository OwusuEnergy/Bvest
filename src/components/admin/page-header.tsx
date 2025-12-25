
'use client';

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", className)}>
      <div className="animate-fade-in-up">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {children}
      </div>
    </div>
  );
}

    