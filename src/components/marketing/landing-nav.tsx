import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shell/theme-toggle";

import { Wordmark } from "@/components/marketing/wordmark";

const SECTION_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const navLinkClass =
  "px-3 py-2 text-sm font-medium text-marketing-muted transition-colors hover:text-marketing-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-marketing-line bg-marketing-bg">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className={focusRing}>
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-marketing-line" />
          <ThemeToggle className="mk-flat" />
          <Button asChild size="sm" className="mk-flat mk-cta">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle className="mk-flat" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="mk-flat">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              id="landing-mobile-menu"
              className="border-marketing-line bg-marketing-bg text-marketing-ink"
            >
              <SheetHeader className="border-b border-marketing-line">
                <SheetTitle className="text-marketing-ink">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {SECTION_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="px-3 py-2.5 text-base font-medium text-marketing-muted transition-colors hover:text-marketing-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto px-4 pb-6">
                <Button asChild className="mk-flat mk-cta w-full">
                  <Link href="/dashboard">Open Dashboard</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
