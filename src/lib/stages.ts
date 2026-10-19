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

export function isStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}
