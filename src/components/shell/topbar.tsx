"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export function Topbar({
  title,
  description,
  onOpenMenu,
}: {
  title: string;
  description: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
      >
        <Menu aria-hidden="true" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Recruiter
        </span>
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-foreground"
        >
          R
        </span>
      </div>
    </header>
  );
}
