import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, UserPlus } from "lucide-react";

import { formatAppliedDate, formatDateTime } from "@/lib/format";
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

// Reads a stage-change event in plain language. `from_stage === null` is the
// pipeline-entry event written when a candidate is created.
function describeEvent(item: DashboardActivityItem): string {
  if (item.kind === "note") return "added a note";
  if (!item.fromStage) {
    return `entered the pipeline as ${item.toStage ? STAGE_LABELS[item.toStage] : "Applied"}`;
  }
  const from = STAGE_LABELS[item.fromStage];
  const to = item.toStage ? STAGE_LABELS[item.toStage] : "—";
  return `moved from ${from} to ${to}`;
}

export function RecentActivity({
  items,
}: {
  items: DashboardActivityItem[];
}) {
  // Items arrive newest-first; consecutive same-day events share a band so a
  // scanner sees "what happened when" before reading each row. The full
  // timestamp still prints on every item, so the band is a visual aid only.
  const groups: { label: string; items: DashboardActivityItem[] }[] = [];
  for (const item of items) {
    const label = formatAppliedDate(item.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <section
      aria-labelledby="dashboard-activity-heading"
      className="rounded-lg border border-border bg-card shadow-xs"
    >
      <div className="border-b border-border px-5 py-3">
        <h2
          id="dashboard-activity-heading"
          className="text-sm font-semibold text-foreground"
        >
          Recent activity
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {items.length === 0
            ? "Stage changes and notes across the pipeline."
            : `Latest ${items.length} event${items.length === 1 ? "" : "s"} across the pipeline.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-foreground">
            No activity recorded yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Stage changes and recruiter notes will appear here as candidates
            move through the pipeline.
          </p>
        </div>
      ) : (
        <ol className="flex flex-col">
          {groups.map((group) => (
            <Fragment key={group.label}>
              <li
                aria-hidden="true"
                className="border-b border-border bg-subtle/60 px-5 py-1.5"
              >
                <span className="text-micro font-medium uppercase text-muted-foreground">
                  {group.label}
                </span>
              </li>
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-border px-5 py-3 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground"
                  >
                    {initialsOf(item.candidateName) || "?"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-start gap-1.5 text-sm text-foreground">
                      {item.kind === "note" ? (
                        <MessageSquare
                          aria-hidden="true"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        />
                      ) : item.fromStage ? (
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        />
                      ) : (
                        <UserPlus
                          aria-hidden="true"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        />
                      )}
                      <span className="min-w-0">
                        <Link
                          href={`/candidates/${item.candidateId}`}
                          className="font-medium underline-offset-2 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {item.candidateName}
                        </Link>{" "}
                        {describeEvent(item)}
                      </span>
                    </p>

                    {item.kind === "note" && item.body && (
                      <p className="mt-1 line-clamp-2 rounded-md bg-subtle px-2.5 py-1.5 text-xs leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-muted-foreground">
                      <time dateTime={item.createdAt}>
                        {formatDateTime(item.createdAt)}
                      </time>
                    </p>
                  </div>
                </li>
              ))}
            </Fragment>
          ))}
        </ol>
      )}
    </section>
  );
}
