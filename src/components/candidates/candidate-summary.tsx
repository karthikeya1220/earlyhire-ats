import type { CandidateWithJob } from "@/lib/types";
import { formatAppliedDate, formatExperience } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StageBadge } from "@/components/candidates/stage-badge";
import { STAGE_ACCENT_STYLES } from "@/components/candidates/stage-badge-styles";

// Compact meta cell: micro label over the value. No icons — the uppercase
// label already names the field, and dropping them keeps the identity block
// (name, role, stage) dominant.
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-micro font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm text-foreground">{children}</dd>
    </div>
  );
}

function initialsOf(name: string): string {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function CandidateSummary({ candidate }: { candidate: CandidateWithJob }) {
  const currentRole = [candidate.current_title, candidate.current_company]
    .filter(Boolean)
    .join(" at ");

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-lg border border-t-2 border-border bg-card p-5 shadow-xs",
        STAGE_ACCENT_STYLES[candidate.stage],
      )}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground"
        >
          {initialsOf(candidate.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-display text-foreground">
            {candidate.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentRole || "No current role on file"}
          </p>
        </div>
        <StageBadge stage={candidate.stage} size="md" className="mt-1 shrink-0" />
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <Row label="Email">
          <a
            href={`mailto:${candidate.email}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            {candidate.email}
          </a>
        </Row>
        <Row label="Phone">
          {candidate.phone ?? <span className="text-muted-foreground">—</span>}
        </Row>
        <Row label="Location">
          {candidate.location ?? (
            <span className="text-muted-foreground">—</span>
          )}
        </Row>
        <Row label="Applied">{formatAppliedDate(candidate.created_at)}</Row>
        <Row label="Experience">
          {candidate.experience_years !== null ? (
            `${formatExperience(candidate.experience_years)} years`
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </Row>
        <Row label="Source">{candidate.source}</Row>
        <Row label="Role">
          {candidate.job_title ? (
            <span>
              {candidate.job_title}
              {candidate.job_status === "closed" && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  (closed)
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )}
        </Row>
      </dl>

      {candidate.skills.length > 0 && (
        <div>
          <h2 className="text-micro font-medium uppercase text-muted-foreground">
            Skills
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground ring-1 ring-inset ring-border"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {candidate.resume_summary && (
        <div>
          <h2 className="text-micro font-medium uppercase text-muted-foreground">
            Resume summary
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {candidate.resume_summary}
          </p>
        </div>
      )}
    </div>
  );
}
