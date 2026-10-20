"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

function useMounted(): boolean {
  return React.useSyncExternalStore(
    React.useCallback(() => () => {}, []),
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  // Keep the SSR-rendered attributes stable: only branch on the resolved
  // theme after mount so the server HTML and first client render match.
  const label = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle color theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && (isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />)}
      {!mounted && <span aria-hidden="true" className="block h-4 w-4" />}
    </Button>
  );
}
