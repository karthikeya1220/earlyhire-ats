import type { Stage } from "@/lib/stages";

// Semantic color tokens per stage. Using theme variables (not raw palette
// classes) means badges adapt automatically in dark mode. Applied uses a
// neutral gray so the accent stages (interview/offer) carry emphasis.
export const STAGE_BADGE_STYLES: Record<Stage, string> = {
  applied: "bg-muted text-muted-foreground ring-border-strong",
  screening: "bg-primary/10 text-primary ring-primary/20",
  shortlisted: "bg-primary/15 text-primary ring-primary/25",
  interview: "bg-primary/20 text-primary ring-primary/30",
  offer: "bg-success/15 text-success ring-success/30",
  joined: "bg-success/20 text-success ring-success/35",
  rejected: "bg-destructive/10 text-destructive ring-destructive/25",
};

// Pipeline bar fills, using the same semantic tokens as the badges. `solid`
// marks candidates currently in a stage; `soft` marks the wider set who have
// ever reached it. Keeping both maps full means a bar can be indexed by Stage
// without a fallback.
export const STAGE_BAR_STYLES: Record<Stage, string> = {
  applied: "bg-muted-foreground/60",
  screening: "bg-primary/45",
  shortlisted: "bg-primary/60",
  interview: "bg-primary/80",
  offer: "bg-success/55",
  joined: "bg-success/85",
  rejected: "bg-destructive/55",
};

export const STAGE_BAR_SOFT_STYLES: Record<Stage, string> = {
  applied: "bg-muted-foreground/20",
  screening: "bg-primary/15",
  shortlisted: "bg-primary/15",
  interview: "bg-primary/15",
  offer: "bg-success/15",
  joined: "bg-success/15",
  rejected: "bg-destructive/15",
};
