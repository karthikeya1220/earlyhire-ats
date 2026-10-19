import { ArrowRight } from "lucide-react";

import { STAGE_LABELS } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { STAGE_BAR_STYLES } from "@/components/candidates/stage-badge-styles";
import type { DashboardConversionStep } from "@/lib/types";

function rateLabel(rate: number | null): string {
  return rate === null ? "—" : `${rate}%`;
}

// Stage progression. Each row names both the numerator and the denominator in
// words, so nobody can read a "60%" as a success rate: it always means "of the
// candidates who reached <from>, 60% also reached <to>". Candidates who were
// rejected simply stop appearing in later denominators.
export function ConversionFunnel({
  steps,
  rejectedCount,
  totalCandidates,
}: {
  steps: DashboardConversionStep[];
  rejectedCount: number;
  totalCandidates: number;
}) {
  return (
    <section
      aria-labelledby="conversion-heading"
      className="rounded-lg border border-border bg-card shadow-xs"
    >
      <div className="border-b border-border px-5 py-3">
        <h2
          id="conversion-heading"
          className="text-sm font-semibold text-foreground"
        >
          Stage progression
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Of the candidates who reached a stage, how many went on to the next.
        </p>
      </div>

      <ol className="flex flex-col">
        {steps.map((step) => (
          <li
            key={`${step.from}-${step.to}`}
            className="border-b border-border px-5 py-3 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-1.5 text-xs text-foreground">
                <span className="truncate">{STAGE_LABELS[step.from]}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 text-muted-foreground"
                />
                <span className="truncate">{STAGE_LABELS[step.to]}</span>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                {rateLabel(step.rate)}
              </span>
            </div>
            {/* Thin meter: the rate again, as length, in the destination
                stage's hue. aria-hidden — the printed percentage above is the
                accessible reading. */}
            {step.rate !== null && (
              <div
                aria-hidden="true"
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn("h-full rounded-full", STAGE_BAR_STYLES[step.to])}
                  style={{ width: `${step.rate}%` }}
                />
              </div>
            )}
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {step.rate === null
                ? `No candidate has reached ${STAGE_LABELS[step.from]} yet.`
                : `${step.toCount} of ${step.fromCount} candidates who reached ${STAGE_LABELS[step.from]} also reached ${STAGE_LABELS[step.to]}.`}
            </p>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-1 border-t border-border px-5 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {rejectedCount} of {totalCandidates} candidate
          {totalCandidates === 1 ? " is" : "s are"} currently rejected. Rejected
          candidates leave the progression above but are still counted wherever
          they previously advanced.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          These are stage-progression ratios, not a hiring success rate.
        </p>
      </div>
    </section>
  );
}
