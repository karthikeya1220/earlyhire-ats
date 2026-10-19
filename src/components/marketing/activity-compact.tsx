import { ArrowRight, MessageSquare, UserPlus } from "lucide-react";

import { formatAppliedDate } from "@/lib/format";
import { STAGE_LABELS } from "@/lib/stages";
import type { DashboardActivityItem } from "@/lib/types";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function describeEvent(item: DashboardActivityItem): string {
  if (item.kind === "note") return "added a note";
  if (!item.fromStage) {
    return `entered the pipeline as ${item.toStage ? STAGE_LABELS[item.toStage] : "Applied"}`;
  }
  return `moved from ${STAGE_LABELS[item.fromStage]} to ${
    item.toStage ? STAGE_LABELS[item.toStage] : "—"
  }`;
}

// Compact activity rows for the hero and feature previews. Dates only (the
// real RecentActivity component prints full timestamps). No links: previews
// are decorative; the text columns elsewhere carry the navigation.
export function ActivityCompact({ items }: { items: DashboardActivityItem[] }) {
  return (
    <ul className="flex min-w-0 flex-col" aria-hidden="true">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex min-w-0 gap-3 border-b border-border px-4 py-2.5 last:border-b-0"
        >
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-foreground text-micro"
          >
            {initialsOf(item.candidateName) || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-foreground">
              <span className="font-medium">{item.candidateName}</span>{" "}
              {describeEvent(item)}
            </p>
            {item.kind === "note" && item.body && (
              <p className="mt-0.5 max-w-[26ch] truncate text-xs text-muted-foreground">
                {item.body}
              </p>
            )}
            <p className="mt-0.5 text-micro text-muted-foreground">
              {formatAppliedDate(item.createdAt)}
            </p>
          </div>
          {item.kind === "note" ? (
            <MessageSquare
              className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground"
            />
          ) : item.fromStage ? (
            <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <UserPlus className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
        </li>
      ))}
    </ul>
  );
}
