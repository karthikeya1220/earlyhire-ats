import Link from "next/link";

import { STAGES, STAGE_LABELS, type Stage } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { StageBadge } from "@/components/candidates/stage-badge";
import {
  STAGE_BAR_SOFT_STYLES,
  STAGE_BAR_STYLES,
} from "@/components/candidates/stage-badge-styles";

// The pipeline chart. Bars encode two different populations on one track:
// the soft fill is everyone who ever reached the stage (share of all
// candidates), the solid fill is the subset still in it. Every number the bar
// encodes is also printed as text, and the bar itself is aria-hidden, so the
// chart is readable without sight of the colors.
export function PipelineBreakdown({
  currentByStage,
  reachedByStage,
  totalCandidates,
}: {
  currentByStage: Record<Stage, number>;
  reachedByStage: Record<Stage, number>;
  totalCandidates: number;
}) {
  return (
    <section
      aria-labelledby="pipeline-heading"
      className="rounded-lg border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-3">
        <h2 id="pipeline-heading" className="text-sm font-medium text-foreground">
          Pipeline by stage
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Bar length is the share of all {totalCandidates} candidates who have
          ever reached a stage. The solid part is how many are in it now.
        </p>
      </div>

      <ul className="flex flex-col">
        {STAGES.map((stage) => {
          const current = currentByStage[stage];
          const reached = reachedByStage[stage];
          const reachedShare =
            totalCandidates === 0 ? 0 : (reached / totalCandidates) * 100;
          const currentShare = reached === 0 ? 0 : (current / reached) * 100;

          return (
            <li
              key={stage}
              className="border-b border-border px-5 py-3 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/candidates?stage=${stage}`}
                  className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <StageBadge stage={stage} />
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-medium tabular-nums text-foreground">
                    {current}
                  </span>{" "}
                  now
                  <span aria-hidden="true"> · </span>
                  <span className="tabular-nums text-foreground">{reached}</span>{" "}
                  ever
                </p>
              </div>

              <div
                aria-hidden="true"
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    STAGE_BAR_SOFT_STYLES[stage],
                  )}
                  style={{ width: `${reachedShare}%` }}
                >
                  <div
                    className={cn("h-full rounded-full", STAGE_BAR_STYLES[stage])}
                    style={{ width: `${currentShare}%` }}
                  />
                </div>
              </div>

              <p className="sr-only">
                {STAGE_LABELS[stage]}: {current} candidate
                {current === 1 ? "" : "s"} currently, {reached} ever reached.
              </p>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-border px-5 py-3 text-[11px] leading-relaxed text-muted-foreground">
        “Ever” counts distinct candidates with a stage-change event for that
        stage, plus anyone sitting in it now. A candidate appears under every
        stage they passed through, so these numbers add up to more than the
        total.
      </p>
    </section>
  );
}
