
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
  CandlestickChart,
  Users,
  Banknote,
  ArrowLeftRight,
  User,
  Shield,
  LogOut,
  Menu,
} from "lucide-react";
import { Cedi } from "@/components/cedi-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invest", href: "/dashboard/invest", icon: Cedi },
  { name: "My Investments", href: "/dashboard/investments", icon: CandlestickChart },
  { name: "Referrals", href: "/dashboard/referrals", icon: Users },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: Banknote },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
];

const sidebarProfileNav = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Security", href: "/dashboard/security", icon: Shield },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {sidebarNav.map((item) => (
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
                <Link href="/">
                  <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
          </SidebarMenu>

          <div className={cn(
              "flex items-center gap-2 rounded-md p-2 text-left text-sm transition-all",
              "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
            )}>
              <Avatar className="h-8 w-8">
                  {avatar && <AvatarImage src={avatar.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-foreground">User</span>
                  <span className="text-xs text-muted-foreground">user@email.com</span>
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
            <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
