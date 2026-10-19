import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Summary metric. When `href` is set the whole tile becomes the link, keeping a
// single obvious target instead of a small "view" affordance.
export function StatTile({
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint?: string;
  href?: string;
  icon: LucideIcon;
}) {
  const content = (
    <>
      <div className="min-w-0">
        <p className="text-micro font-medium uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
      >
        <Icon className="h-4 w-4" />
      </span>
    </>
  );

  const className =
    "flex items-start justify-between gap-3 rounded-lg border border-border bg-card shadow-xs p-4";

  if (!href) return <div className={className}>{content}</div>;

  return (
    <Link
      href={href}
      className={cn(
        className,
        "transition-colors hover:border-border-strong hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {content}
    </Link>
  );
}
