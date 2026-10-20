import { STAGE_LABELS, type Stage } from "@/lib/stages";

import {
  sampleCurrentByStage,
  sampleReachedByStage,
} from "@/components/marketing/demo-data";

// The route: the six forward stages as a transit line. Each station is a
// hollow circle ringed in its stage hue; each segment takes the hue of the
// stage it leads into. Rejected exits the route — it is printed in the
// caption, not strung along the line. All counts come from the seeded
// sample workspace (demo-data.ts), same numbers as the dashboard.
const ROUTE: ReadonlyArray<{
  stage: Stage;
  circle: string;
  segment?: string;
}> = [
  { stage: "applied", circle: "border-stage-applied" },
  {
    stage: "screening",
    circle: "border-stage-screening",
    segment: "bg-stage-screening",
  },
  {
    stage: "shortlisted",
    circle: "border-stage-shortlisted",
    segment: "bg-stage-shortlisted",
  },
  {
    stage: "interview",
    circle: "border-stage-interview",
    segment: "bg-stage-interview",
  },
  {
    stage: "offer",
    circle: "border-stage-offer",
    segment: "bg-stage-offer",
  },
  {
    stage: "joined",
    circle: "border-stage-joined",
    segment: "bg-stage-joined",
  },
];

const SEGMENTS = ROUTE.flatMap((station) =>
  station.segment ? [station.segment] : [],
);

export function RouteStrip() {
  return (
    <section
      aria-label="Sample pipeline route"
      className="border-t border-marketing-line bg-card"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-accent">
            The pipeline, as a route
          </p>
          <p className="font-mono text-micro uppercase tracking-widest text-marketing-muted">
            Now in stage · Ever reached · sample workspace
          </p>
        </div>

        {/* Diagram scrolls horizontally on narrow screens instead of
            shrinking stations below legibility. */}
        {/* Focusable so keyboard users can scroll the strip when it overflows. */}
        <div
          className="mt-6 overflow-x-auto pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          tabIndex={0}
        >
          <div className="relative min-w-[600px]">
            {/* Route line: spans first-station center to last-station
                center (grid-cols-6 → 8.3333% insets), colored per segment. */}
            <div
              aria-hidden="true"
              className="absolute top-[6.5px] left-[8.3333%] right-[8.3333%] flex"
            >
              {SEGMENTS.map((segment) => (
                <span
                  key={segment}
                  className={`h-[3px] flex-1 ${segment}`}
                />
              ))}
              {/* The traveling marker — the one animated moment. A full-bleed
                  wrapper slides right; the dot rides its trailing edge, so the
                  motion is transform-only (composited, no layout). */}
              <span aria-hidden="true" className="marketing-travel absolute inset-0">
                <span className="absolute right-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-marketing-accent" />
              </span>
            </div>

            <ol className="relative grid grid-cols-6">
              {ROUTE.map(({ stage, circle }) => {
                const current = sampleCurrentByStage[stage];
                const reached = sampleReachedByStage[stage];
                return (
                  <li
                    key={stage}
                    className="flex min-w-0 flex-col items-center px-1 text-center"
                  >
                    <span
                      aria-hidden="true"
                      className={`z-10 h-4 w-4 rounded-full border-[3px] bg-card ${circle}`}
                    />
                    <p
                      aria-hidden="true"
                      className="mt-3 font-mono text-micro font-medium uppercase tracking-wider text-marketing-ink"
                    >
                      {STAGE_LABELS[stage]}
                    </p>
                    <p
                      aria-hidden="true"
                      className="mt-1.5 text-title font-semibold tabular-nums text-marketing-ink"
                    >
                      {current}
                    </p>
                    <p
                      aria-hidden="true"
                      className="font-mono text-micro tabular-nums text-marketing-muted"
                    >
                      of {reached} ever
                    </p>
                    <span className="sr-only">
                      {STAGE_LABELS[stage]}: {current} candidates now,{" "}
                      {reached} ever reached.
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-marketing-line pt-4">
          <p className="max-w-xl text-xs leading-relaxed text-marketing-muted">
            Each station is a stage. The large count is who sits there now;
            the smaller count is how many ever reached it.
          </p>
          <p className="font-mono text-micro uppercase tracking-widest text-marketing-muted">
            Rejected {sampleCurrentByStage.rejected} leave the route —
            tracked, never lost
          </p>
        </div>
      </div>
    </section>
  );
}
