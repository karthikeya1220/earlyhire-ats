import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/types";

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-none ring-1 ring-inset",
        status === "open"
          ? "bg-success/10 text-success ring-success/25"
          : "bg-muted text-muted-foreground ring-border-strong",
        className,
      )}
    >
      {status === "open" ? "Open" : "Closed"}
    </span>
  );
}
