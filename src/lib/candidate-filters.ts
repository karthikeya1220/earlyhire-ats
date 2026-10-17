import { isStage, STAGES, type Stage } from "@/lib/stages";
import type { CandidateListFilters } from "@/lib/types";

export const CANDIDATE_SEARCH_PARAM = "q";
export const CANDIDATE_STAGE_PARAM = "stage";
export const CANDIDATE_JOB_PARAM = "job";

// Normalized filter state derived from the URL. Empty strings mean "no filter".
export interface CandidateFilters extends CandidateListFilters {
  q: string;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

// Reads and sanitizes candidate filters from Next's searchParams object.
// Invalid stage values are dropped so a hand-edited URL can't reach the DB.
export function parseCandidateSearchParams(
  params: RawSearchParams,
): CandidateFilters {
  const q = firstValue(params[CANDIDATE_SEARCH_PARAM]).trim();

  const stageRaw = firstValue(params[CANDIDATE_STAGE_PARAM]).trim().toLowerCase();
  const stage = isStage(stageRaw) ? stageRaw : undefined;

  const jobIdRaw = firstValue(params[CANDIDATE_JOB_PARAM]).trim();
  const jobId = jobIdRaw.length > 0 ? jobIdRaw : undefined;

  return { q, stage, jobId };
}

export function hasActiveCandidateFilters(filters: CandidateFilters): boolean {
  return Boolean(filters.q || filters.stage || filters.jobId);
}

// Builds an /candidates href that restores the given filters, so "Back to
// candidates" from a profile returns to the exact filtered list the recruiter
// came from. Unfiltered just yields the bare path.
export function candidatesHref(filters: CandidateFilters): string {
  const qs = candidateFiltersToSearchParams(filters).toString();
  return qs ? `/candidates?${qs}` : "/candidates";
}

// Reusable query suffix (including the leading "?") for carrying the current
// list context into add/edit/profile routes.
export function candidateFilterSuffix(filters: CandidateFilters): string {
  const qs = candidateFiltersToSearchParams(filters).toString();
  return qs ? `?${qs}` : "";
}

// Serializes filters into a URLSearchParams set, omitting empty values so
// shared/bookmarked URLs stay clean and the unfiltered view is just /candidates.
export function candidateFiltersToSearchParams(
  filters: CandidateFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  const q = filters.q.trim();
  if (q) params.set(CANDIDATE_SEARCH_PARAM, q);
  if (filters.stage) params.set(CANDIDATE_STAGE_PARAM, filters.stage);
  if (filters.jobId) params.set(CANDIDATE_JOB_PARAM, filters.jobId);
  return params;
}

// All stages, exported so filter UIs enumerate the canonical list without
// redeclaring it.
export const CANDIDATE_STAGE_OPTIONS: readonly Stage[] = STAGES;
