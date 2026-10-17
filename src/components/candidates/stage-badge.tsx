import { cn } from "@/lib/utils";
import { STAGE_LABELS, type Stage } from "@/lib/stages";
import { STAGE_BADGE_STYLES } from "@/components/candidates/stage-badge-styles";

export function StageBadge({
  stage,
  className,
}: {
  stage: Stage;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-none ring-1 ring-inset",
        STAGE_BADGE_STYLES[stage],
        className,
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
