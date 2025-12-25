
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
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
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }

    const isLoginPage = pathname === '/admin/login';

    if (user && user.uid === ADMIN_UID) {
      // If admin is logged in and on the login page, redirect to dashboard
      if (isLoginPage) {
        router.replace('/admin/dashboard');
      }
    } else {
      // If user is not admin and not on login page, redirect to login
      if (!isLoginPage) {
        router.replace('/admin/login');
      }
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If on the login page, just render the login form
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If user is not the admin, they are being redirected, so render nothing.
  if (!user || user.uid !== ADMIN_UID) {
    return null;
  }

  // If we reach here, user is the authenticated admin, show the dashboard layout
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
