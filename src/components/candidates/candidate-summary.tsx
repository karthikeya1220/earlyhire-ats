import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CandidateWithJob } from "@/lib/types";
import { formatAppliedDate, formatExperience } from "@/lib/format";
import { STAGE_LABELS } from "@/lib/stages";
import { StageBadge } from "@/components/candidates/stage-badge";

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
      />
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-sm text-foreground">
          {children}
        </dd>
      </div>
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
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground"
        >
          {initialsOf(candidate.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {candidate.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {currentRole || "No current role on file"}
          </p>
        </div>
        <StageBadge stage={candidate.stage} className="shrink-0" />
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Row icon={Mail} label="Email">
          <a
            href={`mailto:${candidate.email}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            {candidate.email}
          </a>
        </Row>
        <Row icon={Phone} label="Phone">
          {candidate.phone ?? <span className="text-muted-foreground">—</span>}
        </Row>
        <Row icon={MapPin} label="Location">
          {candidate.location ?? (
            <span className="text-muted-foreground">—</span>
          )}
        </Row>
        <Row icon={CalendarDays} label="Applied">
          {formatAppliedDate(candidate.created_at)}
        </Row>
        <Row icon={Briefcase} label="Experience">
          {candidate.experience_years !== null ? (
            `${formatExperience(candidate.experience_years)} years`
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </Row>
        <Row icon={Link2} label="Source">
          {candidate.source}
        </Row>
        <Row icon={Building2} label="Role">
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
        <Row icon={FileText} label="Stage">
          {STAGE_LABELS[candidate.stage]}
        </Row>
      </dl>

      {candidate.skills.length > 0 && (
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Skills
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <li
                key={skill}
                className={cn(
                  "rounded-full bg-muted px-2 py-0.5 text-xs text-foreground ring-1 ring-inset ring-border",
                )}
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {candidate.resume_summary && (
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
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
