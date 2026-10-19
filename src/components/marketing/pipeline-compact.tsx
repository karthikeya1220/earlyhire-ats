import { STAGES, STAGE_LABELS } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { StageBadge } from "@/components/candidates/stage-badge";
import {
  STAGE_BAR_SOFT_STYLES,
  STAGE_BAR_STYLES,
} from "@/components/candidates/stage-badge-styles";

import {
  sampleCurrentByStage,
  sampleReachedByStage,
  sampleStats,
} from "@/components/marketing/demo-data";

// Compact now·ever pipeline rows for the hero and feature previews. Same
// encoding as the real PipelineBreakdown — bar length is share of the whole
// pipeline, the solid fill is the current subset, and every number is printed.
export function PipelineCompact() {
  return (
    <ul className="flex flex-col">
      {STAGES.map((stage) => {
        const current = sampleCurrentByStage[stage];
        const reached = sampleReachedByStage[stage];
        const reachedShare =
          (reached / sampleStats.totalCandidates) * 100;
        const currentShare =
          (current / sampleStats.totalCandidates) * 100;

        return (
          <li
            key={stage}
            className="flex items-center gap-3 border-b border-border px-4 py-2 last:border-b-0"
          >
            <StageBadge stage={stage} className="w-20 shrink-0 justify-center" />
            <div
              aria-hidden="true"
              className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  STAGE_BAR_SOFT_STYLES[stage],
                )}
                style={{ width: `${reachedShare}%` }}
              />
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  STAGE_BAR_STYLES[stage],
                )}
                style={{ width: `${currentShare}%` }}
              />
            </div>
            <p className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              <span className="font-medium text-foreground">{current}</span>
              <span aria-hidden="true"> · </span>
              <span>{reached}</span>
            </p>
            <span className="sr-only">
              {STAGE_LABELS[stage]}: {current} candidate
              {current === 1 ? "" : "s"} currently, {reached} ever reached.
            </span>
          </li>
        );
      })}
    </ul>
  );
}
