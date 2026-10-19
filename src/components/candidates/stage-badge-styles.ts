import type { Stage } from "@/lib/stages";

// One hue per stage, drawn from the --stage-* design tokens so badges, bars
// and chips agree and dark mode flips with the theme. Applied stays neutral
// gray (it is the "everything" bucket); the pipeline hues then read as one
// ordered ramp — sky → indigo → amber → green — with red for rejected.
export const STAGE_BADGE_STYLES: Record<Stage, string> = {
  applied: "bg-stage-applied/10 text-stage-applied ring-stage-applied/30",
  screening: "bg-stage-screening/12 text-stage-screening ring-stage-screening/30",
  shortlisted:
    "bg-stage-shortlisted/12 text-stage-shortlisted ring-stage-shortlisted/30",
  interview: "bg-stage-interview/15 text-stage-interview ring-stage-interview/35",
  offer: "bg-stage-offer/12 text-stage-offer ring-stage-offer/30",
  joined: "bg-stage-joined/12 text-stage-joined ring-stage-joined/30",
  rejected: "bg-stage-rejected/10 text-stage-rejected ring-stage-rejected/30",
};

// Selected stage radio chip: same hue, plus a matching border so the choice
// reads as a picked control rather than a badge.
export const STAGE_CHIP_STYLES: Record<Stage, string> = {
  applied: "border-stage-applied/40 bg-stage-applied/10 text-stage-applied",
  screening:
    "border-stage-screening/40 bg-stage-screening/12 text-stage-screening",
  shortlisted:
    "border-stage-shortlisted/40 bg-stage-shortlisted/12 text-stage-shortlisted",
  interview:
    "border-stage-interview/45 bg-stage-interview/15 text-stage-interview",
  offer: "border-stage-offer/40 bg-stage-offer/12 text-stage-offer",
  joined: "border-stage-joined/40 bg-stage-joined/12 text-stage-joined",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
};

// Pipeline bar fills. `solid` marks candidates currently in a stage; `soft`
// marks the wider set who have ever reached it. Full maps so a bar can be
// indexed by Stage without a fallback. Applied's fills stay muted so the
// biggest bucket doesn't dominate the chart.
export const STAGE_BAR_STYLES: Record<Stage, string> = {
  applied: "bg-stage-applied/55",
  screening: "bg-stage-screening",
  shortlisted: "bg-stage-shortlisted",
  interview: "bg-stage-interview",
  offer: "bg-stage-offer",
  joined: "bg-stage-joined",
  rejected: "bg-stage-rejected",
};

export const STAGE_BAR_SOFT_STYLES: Record<Stage, string> = {
  applied: "bg-stage-applied/18",
  screening: "bg-stage-screening/25",
  shortlisted: "bg-stage-shortlisted/25",
  interview: "bg-stage-interview/25",
  offer: "bg-stage-offer/25",
  joined: "bg-stage-joined/25",
  rejected: "bg-stage-rejected/22",
};

// 2px stage-colored top rule for the profile identity card — the one place
// the candidate's current stage colors the layout itself.
export const STAGE_ACCENT_STYLES: Record<Stage, string> = {
  applied: "border-t-stage-applied/70",
  screening: "border-t-stage-screening",
  shortlisted: "border-t-stage-shortlisted",
  interview: "border-t-stage-interview",
  offer: "border-t-stage-offer",
  joined: "border-t-stage-joined",
  rejected: "border-t-stage-rejected",
};
