export const STAGES = [
  "applied",
  "screening",
  "shortlisted",
  "interview",
  "offer",
  "joined",
  "rejected",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  applied: "Applied",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  joined: "Joined",
  rejected: "Rejected",
};

// Tailwind classes for stage badges. Kept as a full map so a component can
// index by Stage without needing a fallback.
export const STAGE_BADGE_CLASSES: Record<Stage, string> = {
  applied: "bg-slate-100 text-slate-700 ring-slate-200",
  screening: "bg-sky-100 text-sky-700 ring-sky-200",
  shortlisted: "bg-violet-100 text-violet-700 ring-violet-200",
  interview: "bg-amber-100 text-amber-800 ring-amber-200",
  offer: "bg-orange-100 text-orange-700 ring-orange-200",
  joined: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-100 text-rose-700 ring-rose-200",
};

export function isStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}
