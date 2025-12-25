
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Car,
  Users,
  Banknote,
  LogOut,
  Menu,
  Loader2,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminNavLinks, authLinks } from "@/lib/constants";
import { useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

const sidebarProfileNav = [
  { name: "Admin Settings", href: "/admin/settings", icon: Settings },
];

// This should be stored in a secure environment variable in a real application
const ADMIN_UID = 'pYJb2fT8ZaRjS4eXq2tWz3fG8yH3';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    // This effect handles redirection based on authentication state.
    if (!isUserLoading) {
      if (isAdmin) {
        // If user is admin and on the login page, redirect to dashboard.
        if (pathname === '/admin/login') {
          router.push('/admin');
        }
      } else {
        // If user is not admin (or not logged in) and not on the login page, redirect them there.
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    }
  }, [isUserLoading, user, isAdmin, router, pathname]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/login');
    }
  };

  // If auth state is still loading, show a full-screen loader.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is not an admin and is trying to access a non-login page,
  // we show the loading screen while the useEffect above redirects them.
  // This prevents flashing the admin layout to non-admins.
  if (!isAdmin && pathname !== '/admin/login') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Allow the login page to be rendered without the admin layout shell.
  if (!isAdmin && pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (isAdmin && pathname === '/admin/login') {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If we've made it here, the user is an admin and not on the login page.
  // Render the full admin layout.
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
                <Link href={item.path!}>
                  <SidebarMenuButton
                    isActive={pathname === item.path}
                    tooltip={item.name}
                  >
                    {item.name === 'Dashboard' && <LayoutDashboard />}
                    {item.name === 'Cars' && <Car />}
                    {item.name === 'Users' && <Users />}
                    {item.name === 'Withdrawals' && <Banknote />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {sidebarProfileNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>

          <div className={cn(
              "flex items-center gap-2 rounded-md p-2 text-left text-sm transition-all",
              "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
            )}>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-foreground">Admin</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3 text-primary" />
                    Administrator
                  </span>
              </div>
          </div>

        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <SidebarTrigger>
                <Menu className="h-6 w-6"/>
              </SidebarTrigger>
            </div>
            <div className="flex-1">
              {/* Add breadcrumbs or page title here */}
            </div>
             <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
