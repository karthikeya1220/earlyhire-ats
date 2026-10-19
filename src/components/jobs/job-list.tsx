import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { JobStatusToggle } from "@/components/jobs/job-status-toggle";

function JobRow({ job }: { job: Job }) {
  const meta = [job.department, job.location, job.employment_type]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex flex-col gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "truncate text-sm font-semibold",
              job.status === "open"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {job.title}
          </h3>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
      </div>

      <JobStatusToggle
        jobId={job.id}
        jobTitle={job.title}
        status={job.status}
      />
    </li>
  );
}

export function JobList({ jobs }: { jobs: Job[] }) {
  const open = jobs.filter((job) => job.status === "open");
  const closed = jobs.filter((job) => job.status === "closed");

  return (
    <div className="mt-6 flex flex-col gap-6">
      <section aria-labelledby="open-roles-heading">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="open-roles-heading"
            className="text-micro font-medium uppercase text-muted-foreground"
          >
            Open roles
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {open.length}
          </span>
        </div>

        {open.length === 0 ? (
          <div className="mt-2 rounded-lg border border-dashed border-border-strong bg-card px-6 py-8 text-center">
            <p className="text-sm font-semibold text-foreground">No open roles</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create a role to start assigning candidates.
            </p>
          </div>
        ) : (
          <ul className="mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
            {open.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section aria-labelledby="closed-roles-heading">
          <div className="flex items-center justify-between gap-2">
            <h2
              id="closed-roles-heading"
              className="text-micro font-medium uppercase text-muted-foreground"
            >
              Closed roles
            </h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {closed.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Candidates already assigned to a closed role keep their assignment.
            Closing only prevents new assignments.
          </p>

          <ul className="mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
            {closed.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
