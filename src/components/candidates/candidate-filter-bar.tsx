"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CANDIDATE_STAGE_OPTIONS,
  candidateFiltersToSearchParams,
  hasActiveCandidateFilters,
  type CandidateFilters,
} from "@/lib/candidate-filters";
import { STAGE_LABELS } from "@/lib/stages";
import { Button } from "@/components/ui/button";

export function CandidateFilterBar({
  filters,
  jobs,
}: {
  filters: CandidateFilters;
  jobs: { id: string; title: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Local mirror of the URL so typing feels instant, while the URL stays the
  // source of truth for the rendered results.
  const [search, setSearch] = React.useState(filters.q);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // The last `q` this bar itself wrote. A mismatch against `filters.q` means the
  // URL changed elsewhere (back/forward, external reset) rather than via our own
  // debounced write.
  const lastAppliedQ = React.useRef(filters.q);

  // Clear any pending debounce before mirroring an external `q`, so a stale
  // keystroke can't fire after back navigation and clobber the restored URL.
  const syncFromExternalQ = (nextQ: string): string => {
    if (lastAppliedQ.current === nextQ) return nextQ;
    lastAppliedQ.current = nextQ;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    return nextQ;
  };

  // Mirror external `q` changes (back/forward, links that land on
  // /candidates with a different q) into the input. When the new `filters.q`
  // matches what this bar last applied, the change is our own debounced write
  // and the input is left alone so in-flight keystrokes survive the round
  // trip. No navigation is issued here, so this can't loop.
  React.useEffect(() => {
    if (lastAppliedQ.current === filters.q) return;
    lastAppliedQ.current = filters.q;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSearch(filters.q);
  }, [filters.q]);

  const applyFilters = React.useCallback(
    (next: CandidateFilters) => {
      const params = candidateFiltersToSearchParams(next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  // Debounced search so we don't navigate on every keystroke.
  const onSearchChange = (value: string) => {
    syncFromExternalQ(search);
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastAppliedQ.current = value;
      applyFilters({ ...filters, q: value });
    }, 300);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearSearch = () => {
    syncFromExternalQ(search);
    setSearch("");
    lastAppliedQ.current = "";
    searchRef.current?.focus();
    applyFilters({ ...filters, q: "" });
  };

  const onStageChange = (value: string) => {
    applyFilters({
      ...filters,
      stage: value === "all" ? undefined : (value as CandidateFilters["stage"]),
    });
  };

  const onJobChange = (value: string) => {
    applyFilters({ ...filters, jobId: value === "all" ? undefined : value });
  };

  const onReset = () => {
    syncFromExternalQ(search);
    setSearch("");
    lastAppliedQ.current = "";
    applyFilters({ q: "" });
  };

  const showReset = hasActiveCandidateFilters({ ...filters, q: search });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email, skills…"
          aria-label="Search candidates"
          className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="stage-filter">
          Filter by stage
        </label>
        <select
          id="stage-filter"
          value={filters.stage ?? "all"}
          onChange={(e) => onStageChange(e.target.value)}
          className={cn(
            "h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            filters.stage && "border-primary/40 text-primary",
          )}
        >
          <option value="all">All stages</option>
          {CANDIDATE_STAGE_OPTIONS.map((stage) => (
            <option key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="job-filter">
          Filter by role
        </label>
        <select
          id="job-filter"
          value={filters.jobId ?? "all"}
          onChange={(e) => onJobChange(e.target.value)}
          className={cn(
            "h-9 max-w-[12rem] rounded-md border border-border bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            filters.jobId && "border-primary/40 text-primary",
          )}
        >
          <option value="all">All roles</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        {showReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
