
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
import { useEffect, useState } from "react";

const sidebarProfileNav = [
  { name: "Admin Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This check runs only on the client-side
    const adminSession = sessionStorage.getItem('isAdminAuthenticated');
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setIsLoading(false);
  }, [router]);


  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  if (isLoading || !isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
