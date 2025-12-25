
'use client';

import { usePathname } from 'next/navigation';
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
