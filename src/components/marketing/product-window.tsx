import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// The "product window": a flat chrome bar plus the app's own components
// inside. The only elevated surface on the landing page — it frames the
// interface as a distinct layer above the marketing paper.
export function ProductWindow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle/60 px-4 py-2">
        <p className="truncate font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="shrink-0 rounded-md border border-border bg-card px-2 py-0.5 font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
          Sample workspace
        </span>
      </div>
      {children}
    </div>
  );
}
