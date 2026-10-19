"use client";

import { Suspense, useState } from "react";

import { SidebarBrand, SidebarNav } from "@/components/shell/sidebar-nav";
import { TopbarSlot } from "@/components/shell/topbar-slot";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Static fallback so the shell can prerender on routes with unresolvable
// params (e.g. /candidates/[id] without generateStaticParams). The pathname
// consumers below suspend during prerender and hydrate to the real UI.
function NavFallback() {
  return <div aria-hidden="true" className="flex-1" />;
}

function TopbarFallback() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-28 rounded bg-muted" />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center border-b border-border px-3">
          <SidebarBrand />
        </div>
        <div className="flex flex-1 flex-col gap-6 py-4">
          <Suspense fallback={<NavFallback />}>
            <SidebarNav />
          </Suspense>
        </div>
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <span className="hidden" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="h-14 items-center border-b border-border px-3">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarBrand />
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-6 py-4">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<TopbarFallback />}>
          <TopbarSlot onOpenMenu={() => setMenuOpen(true)} />
        </Suspense>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
