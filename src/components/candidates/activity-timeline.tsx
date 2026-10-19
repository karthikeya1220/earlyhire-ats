import { ArrowRight, MessageSquare, UserPlus } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import { STAGE_LABELS, type Stage } from "@/lib/stages";
import type { CandidateEvent } from "@/lib/types";

function StageChangeEntry({
  event,
  candidateName,
}: {
  event: CandidateEvent;
  candidateName: string;
}) {
  const from = event.from_stage ? STAGE_LABELS[event.from_stage as Stage] : null;
  const to = event.to_stage ? STAGE_LABELS[event.to_stage as Stage] : "—";
  // First entry has from_stage null — the candidate entered the pipeline.
  const isFirst = event.from_stage === null;

  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
      >
        {isFirst ? (
          <UserPlus className="h-3.5 w-3.5" />
        ) : (
          <ArrowRight className="h-3.5 w-3.5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          {isFirst ? (
            <>
              <span className="font-medium">{candidateName}</span> entered the
              pipeline as <span className="font-medium">{to}</span>
            </>
          ) : (
            <>
              Moved from <span className="font-medium">{from}</span> to{" "}
              <span className="font-medium">{to}</span>
            </>
          )}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <time dateTime={event.created_at}>{formatDateTime(event.created_at)}</time>
        </p>
      </div>
    </div>
  );
}

function NoteEntry({ event }: { event: CandidateEvent }) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-inset ring-border"
      >
        <MessageSquare className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Recruiter note</p>
        {event.body && (
          <p className="mt-1 whitespace-pre-wrap rounded-md bg-subtle px-3 py-2 text-sm leading-relaxed text-foreground">
            {event.body}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          <time dateTime={event.created_at}>{formatDateTime(event.created_at)}</time>
        </p>
      </div>
    </div>
  );
}

export function ActivityTimeline({
  events,
  candidateName,
}: {
  events: CandidateEvent[];
  candidateName: string;
}) {
  if (events.length === 0) {
    return (
      <section
        aria-labelledby="activity-heading"
        className="rounded-lg border border-border bg-card shadow-xs p-5"
      >
        <h2 id="activity-heading" className="text-sm font-semibold text-foreground">
          Activity
        </h2>
        <div className="py-8 text-center">
          <p className="text-sm font-semibold text-foreground">No activity yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Stage changes and notes will appear here once this candidate moves
            through the pipeline.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="activity-heading"
      className="rounded-lg border border-border bg-card shadow-xs p-5"
    >
      <h2 id="activity-heading" className="text-sm font-semibold text-foreground">
        Activity
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground" role="status">
        {events.length} entr{events.length === 1 ? "y" : "ies"}, newest first
      </p>
      <ol className="mt-4 flex flex-col gap-4">
        {events.map((event) => (
          <li key={event.id}>
            {event.kind === "stage_change" ? (
              <StageChangeEntry event={event} candidateName={candidateName} />
            ) : (
              <NoteEntry event={event} />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
