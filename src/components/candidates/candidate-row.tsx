import Link from "next/link";

import type { CandidateWithJob } from "@/lib/types";
import { formatAppliedDate, formatExperience } from "@/lib/format";
import { StageBadge } from "@/components/candidates/stage-badge";

export function CandidateRow({
  candidate,
  href,
}: {
  candidate: CandidateWithJob;
  // Includes the list's current filters so the profile can offer a back link
  // to the exact view the recruiter came from.
  href: string;
}) {
  const initials = candidate.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-foreground"
      >
        {initials || "?"}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">
            {candidate.name}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="truncate">{candidate.email}</span>
          {candidate.current_title && (
            <>
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <span className="truncate">{candidate.current_title}</span>
            </>
          )}
          {candidate.experience_years !== null && (
            <>
              <span aria-hidden="true" className="hidden lg:inline">
                ·
              </span>
              <span className="hidden lg:inline">
                {formatExperience(candidate.experience_years)} yrs
              </span>
            </>
          )}
        </div>
      </div>

      <div className="hidden w-44 shrink-0 md:block">
        <span className="truncate text-xs text-foreground">
          {candidate.job_title ?? "Unassigned"}
        </span>
      </div>

      <div className="hidden w-24 shrink-0 sm:block">
        <StageBadge stage={candidate.stage} />
      </div>

      <div className="hidden w-20 shrink-0 text-xs text-muted-foreground lg:block">
        {candidate.source}
      </div>

      <div className="hidden w-24 shrink-0 text-xs text-muted-foreground sm:block">
        {formatAppliedDate(candidate.created_at)}
      </div>
    </Link>
  );
}
