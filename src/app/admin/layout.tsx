
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { adminNavLinks } from "@/lib/constants";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_UID = "L29dCjetU2WAK2G5QcIWu5TrCg33"; // Pre-defined admin UID

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading, do nothing yet.
    if (isUserLoading) {
      return;
    }

    // If not logged in, or if logged-in user is not the admin, redirect to admin login
    if (!user || user.uid !== ADMIN_UID) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router]);

  // While loading, show a full-screen loader
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is loaded but is not the admin, they will be redirected by the effect.
  // Render nothing here to prevent content flashing.
  if (!user || user.uid !== ADMIN_UID) {
    return null;
  }

  // If we reach here, user is authenticated as admin
  return (
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                {adminNavLinks.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <Link href={item.href}>
                            <SidebarMenuButton isActive={pathname === item.href} tooltip={item.name}>
                                <item.icon />
                                <span>{item.name}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
             <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
}
