import Link from "next/link";
import { Plus } from "lucide-react";

import type { CandidateWithJob, Job } from "@/lib/types";
import {
  candidateFilterSuffix,
  hasActiveCandidateFilters,
  type CandidateFilters,
} from "@/lib/candidate-filters";
import { Button } from "@/components/ui/button";
import { CandidateFilterBar } from "@/components/candidates/candidate-filter-bar";
import { CandidateRow } from "@/components/candidates/candidate-row";
import {
  EmptyCandidatesState,
  NoResultsState,
} from "@/components/candidates/empty-states";

export function CandidateList({
  candidates,
  jobs,
  filters,
  allEmpty,
}: {
  candidates: CandidateWithJob[];
  jobs: Job[];
  filters: CandidateFilters;
  // True when the workspace has no candidates at all (ignores filters).
  allEmpty: boolean;
}) {
  const hasFilters = hasActiveCandidateFilters(filters);
  const filterSuffix = candidateFilterSuffix(filters);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Candidates</h2>
          <p className="mt-0.5 text-xs text-muted-foreground" role="status">
            {candidates.length === 0
              ? "No candidates match the current view."
              : `${candidates.length} candidate${candidates.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/candidates/new${filterSuffix}`}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add candidate
          </Link>
        </Button>
      </div>

      <CandidateFilterBar
        filters={filters}
        jobs={jobs.map((job) => ({ id: job.id, title: job.title }))}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div
          aria-hidden="true"
          className="hidden items-center gap-4 border-b border-border bg-subtle px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:flex"
        >
          <span className="w-8" />
          <span className="flex-1">Candidate</span>
          <span className="hidden w-44 md:block">Role</span>
          <span className="hidden w-24 sm:block">Stage</span>
          <span className="hidden w-20 lg:block">Source</span>
          <span className="hidden w-24 sm:block">Applied</span>
        </div>

        {allEmpty ? (
          <EmptyCandidatesState />
        ) : candidates.length === 0 ? (
          <NoResultsState hasFilters={hasFilters} />
        ) : (
          <div>
            {candidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                href={`/candidates/${candidate.id}${filterSuffix}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
