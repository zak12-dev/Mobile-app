"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // ex: /dashboard/agents/123
  const segments = pathname.split("/").filter(Boolean); // ['dashboard','agents','123']

  // Ne garder que le premier segment après 'dashboard'
  const pageSegment = segments[1] ?? "";

  // Formater le texte : 'agents' → 'Agents'
  const pageTitle = pageSegment
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <SidebarProvider>
      <AppSidebar activePath={pathname} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <Breadcrumb>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{pageTitle || "Dashboard"}</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </header>

        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
