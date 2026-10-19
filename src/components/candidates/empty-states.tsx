"use client";

import Link from "next/link";
import { Users, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

// Shown when there are zero candidates in the workspace at all (no filters).
export function EmptyCandidatesState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Users aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          No candidates yet
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Candidates you add will show up here so you can track them through
          the pipeline.
        </p>
      </div>
    </div>
  );
}

// Shown when filters/search exclude every candidate. `hasFilters` lets the
// copy distinguish "your search found nothing" from "no data at all".
export function NoResultsState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {hasFilters ? "No matching candidates" : "No candidates to show"}
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {hasFilters
            ? "Try a different search term or adjust the filters."
            : "There are no candidates in this view."}
        </p>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" asChild>
          <Link href="/candidates">Clear filters</Link>
        </Button>
      )}
    </div>
  );
}
