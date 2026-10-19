import { cn } from "@/lib/utils";
import { STAGE_LABELS, type Stage } from "@/lib/stages";
import { STAGE_BADGE_STYLES } from "@/components/candidates/stage-badge-styles";

export function StageBadge({
  stage,
  size = "sm",
  className,
}: {
  stage: Stage;
  // "sm" for dense list/table rows, "md" for focal placements (profile header).
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none ring-1 ring-inset",
        size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
        STAGE_BADGE_STYLES[stage],
        className,
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
