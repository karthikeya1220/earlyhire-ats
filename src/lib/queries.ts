import { cache } from "react";

import { STAGES, type Stage } from "./stages";
import { buildCandidateSearchFilter } from "./search-filter";
import { getSupabase } from "./supabase/server";
import { isUuid } from "./utils";
import type {
  Candidate,
  CandidateEvent,
  CandidateListFilters,
  CandidateWithJob,
  DashboardActivityItem,
  DashboardConversionStep,
  DashboardStats,
  EventType,
  Job,
  JobStatus,
} from "./types";

const ACTIVE_STAGES = ["applied", "screening", "shortlisted", "interview", "offer"] as const;

// PostgREST only populates `error` when the response body is a structured
// error object. A non-2xx with an empty body (e.g. 404 from a misconfigured
// endpoint, 502 from a proxy) resolves as `{ data: null, error: null }`, which
// `data ?? []` would turn into a silent empty result. Treat a null payload on a
// request that must return rows as a hard failure instead.
function unwrapRows<T>(
  rows: T[] | null,
  error: { message: string } | null,
  context: string,
): T[] {
  if (error) throw new Error(`${context}: ${error.message}`);
  if (rows === null) {
    throw new Error(
      `${context}: the database returned no result set (the endpoint may be unreachable)`,
    );
  }
  return rows;
}

function pct(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export async function listCandidates(
  filters: CandidateListFilters,
): Promise<CandidateWithJob[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("ats_candidates")
    .select("*, ats_jobs(title,status)")
    .order("created_at", { ascending: false });

  if (filters.stage) query = query.eq("stage", filters.stage);
  if (filters.jobId) query = query.eq("job_id", filters.jobId);
  if (filters.q) {
    // Two-layer escaping (LIKE literals + PostgREST filter grammar) lives in
    // search-filter.ts; the skills clauses are dropped there when the term
    // contains array-literal structural characters.
    const orFilter = buildCandidateSearchFilter(filters.q);
    if (orFilter) query = query.or(orFilter);
  }

  const { data, error } = await query;
  const rows = unwrapRows<Candidate & { ats_jobs: { title: string; status: string } | null }>(
    data,
    error,
    "Failed to list candidates",
  );

  return rows.map(({ ats_jobs, ...candidate }) => ({
    ...candidate,
    stage: candidate.stage as Stage,
    job_title: ats_jobs?.title ?? null,
    job_status: ats_jobs?.status as JobStatus | null,
  }));
}

// Wrapped in React's request-scoped cache so generateMetadata and the page
// share one pair of queries per request instead of hitting the database twice.
export const getCandidateWithDetails = cache(async function getCandidateWithDetails(
  id: string,
): Promise<{ candidate: CandidateWithJob; events: CandidateEvent[] } | null> {
  // A hand-edited or stale URL is a not-found, not a database error. Returning
  // null here lets the route render its 404 segment.
  if (!isUuid(id)) return null;

  const supabase = getSupabase();

  const { data: candidateRow, error: candidateError } = await supabase
    .from("ats_candidates")
    .select("*, ats_jobs(title,status)")
    .eq("id", id)
    .maybeSingle();

  if (candidateError) {
    throw new Error(`Failed to load candidate: ${candidateError.message}`);
  }
  if (!candidateRow) return null;

  const { data: eventRows, error: eventError } = await supabase
    .from("ats_events")
    .select("*")
    .eq("candidate_id", id)
    // Newest first. This matches the (candidate_id, created_at desc) index;
    // id breaks timestamp ties deterministically.
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  const events = unwrapRows<CandidateEvent>(
    eventRows,
    eventError,
    "Failed to load candidate history",
  );

  const { ats_jobs, ...rest } = candidateRow;

  return {
    candidate: {
      ...(rest as Candidate),
      stage: rest.stage as Stage,
      job_title: ats_jobs?.title ?? null,
      job_status: (ats_jobs?.status ?? null) as JobStatus | null,
    },
    events,
  };
});

export async function listJobs(onlyOpen = false): Promise<Job[]> {
  const supabase = getSupabase();
  let query = supabase.from("ats_jobs").select("*").order("created_at", { ascending: false });
  if (onlyOpen) query = query.eq("status", "open");

  const { data, error } = await query;
  return unwrapRows<Job>(data, error, "Failed to list jobs");
}

// The funnel ladder, in order. Each step's denominator is the earlier stage.
const CONVERSION_STEPS: readonly { from: Stage; to: Stage }[] = [
  { from: "applied", to: "screening" },
  { from: "screening", to: "shortlisted" },
  { from: "shortlisted", to: "interview" },
  { from: "interview", to: "offer" },
  { from: "offer", to: "joined" },
];

const RECENT_ACTIVITY_LIMIT = 8;

interface DashboardEventRow {
  id: string;
  candidate_id: string;
  kind: EventType;
  from_stage: Stage | null;
  to_stage: Stage | null;
  body: string | null;
  created_at: string;
}

function zeroedStageRecord(): Record<Stage, number> {
  return Object.fromEntries(STAGES.map((stage) => [stage, 0])) as Record<
    Stage,
    number
  >;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabase();

  // One pass over ats_events feeds both the funnel and the activity list, so
  // the dashboard costs three queries rather than four. Candidate names come
  // from the candidate query instead of an embed to keep the types flat.
  const [candidatesRes, jobsRes, eventsRes] = await Promise.all([
    supabase.from("ats_candidates").select("id,name,stage"),
    supabase.from("ats_jobs").select("id,status"),
    supabase
      .from("ats_events")
      .select("id,candidate_id,kind,from_stage,to_stage,body,created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const candidateRows = unwrapRows<{ id: string; name: string; stage: Stage }>(
    candidatesRes.data,
    candidatesRes.error,
    "Failed to count candidates",
  );
  const jobRows = unwrapRows<{ id: string; status: JobStatus }>(
    jobsRes.data,
    jobsRes.error,
    "Failed to list jobs",
  );
  const eventRows = unwrapRows<DashboardEventRow>(
    eventsRes.data,
    eventsRes.error,
    "Failed to load pipeline history",
  );

  // Candidates currently in each stage. This is the only count that sums to
  // the total, because a candidate has exactly one current stage.
  const currentByStage = zeroedStageRecord();
  for (const row of candidateRows) {
    const stage = row.stage as Stage;
    if (stage in currentByStage) currentByStage[stage] += 1;
  }

  const reachedSets = Object.fromEntries(
    STAGES.map((stage) => [stage, new Set<string>()]),
  ) as Record<Stage, Set<string>>;
  for (const row of eventRows) {
    if (row.kind !== "stage_change") continue;
    const to = row.to_stage as Stage | null;
    if (to && to in reachedSets) reachedSets[to].add(row.candidate_id);
  }
  // Someone sitting in a stage has necessarily reached it. Unioning the
  // current stage keeps "reached" >= "current" even if an event is missing
  // (e.g. a stage written by direct SQL), so the funnel can never show a
  // person counted below a stage they are standing in.
  for (const row of candidateRows) reachedSets[row.stage].add(row.id);

  const reachedByStage = zeroedStageRecord();
  for (const stage of STAGES) reachedByStage[stage] = reachedSets[stage].size;

  const conversionSteps: DashboardConversionStep[] = CONVERSION_STEPS.map(
    ({ from, to }) => ({
      from,
      to,
      fromCount: reachedByStage[from],
      toCount: reachedByStage[to],
      rate: pct(reachedByStage[to], reachedByStage[from]),
    }),
  );

  const nameById = new Map<string, string>(
    candidateRows.map((row) => [row.id, row.name] as [string, string]),
  );
  const recentActivity: DashboardActivityItem[] = eventRows
    .slice(0, RECENT_ACTIVITY_LIMIT)
    .map((row) => ({
      id: row.id,
      candidateId: row.candidate_id,
      candidateName: nameById.get(row.candidate_id) ?? "Unknown candidate",
      kind: row.kind,
      fromStage: row.from_stage,
      toStage: row.to_stage,
      body: row.body,
      createdAt: row.created_at,
    }));

  return {
    totalCandidates: candidateRows.length,
    openRoles: jobRows.filter((job) => job.status === "open").length,
    closedRoles: jobRows.filter((job) => job.status === "closed").length,
    currentByStage,
    reachedByStage,
    conversionSteps,
    recentActivity,
  };
}

export function isActiveStage(stage: Stage): boolean {
  return (ACTIVE_STAGES as readonly string[]).includes(stage);
}
