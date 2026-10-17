import type { Stage } from "./stages";

export type { Stage } from "./stages";
export type JobStatus = "open" | "closed";

export type Job = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string;
  status: JobStatus;
  created_at: string;
};

export type Candidate = {
  id: string;
  job_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  current_company: string | null;
  experience_years: number | null;
  skills: string[];
  resume_summary: string | null;
  source: string;
  stage: Stage;
  created_at: string;
  updated_at: string;
};

export type EventType = "stage_change" | "note";

export type CandidateEvent = {
  id: string;
  candidate_id: string;
  kind: EventType;
  from_stage: Stage | null;
  to_stage: Stage | null;
  body: string | null;
  created_at: string;
};

// A candidate joined with its job title for list views.
export type CandidateWithJob = Candidate & {
  job_title: string | null;
  job_status: JobStatus | null;
};

export interface CandidateListFilters {
  q?: string;
  stage?: Stage;
  jobId?: string;
}

// One progression step, e.g. Screening -> Shortlisted. The denominator is
// always the earlier stage, so the rate answers a single explicit question:
// of the candidates who reached `from`, how many also reached `to`? It is a
// stage-progression ratio, not a hiring success rate.
export interface DashboardConversionStep {
  from: Stage;
  to: Stage;
  // Distinct candidates who ever reached each stage (see reachedByStage).
  fromCount: number;
  toCount: number;
  // null when no candidate has reached the earlier stage yet — never 0%,
  // which would read as failure instead of "no data"
  rate: number | null;
}

// A real ats_events row joined to its candidate's name for the activity feed.
export interface DashboardActivityItem {
  id: string;
  candidateId: string;
  candidateName: string;
  kind: EventType;
  fromStage: Stage | null;
  toStage: Stage | null;
  body: string | null;
  createdAt: string;
}

// Dashboard aggregates, computed per request from ats_candidates, ats_events
// and ats_jobs. Nothing here is stored, cached across requests, or hardcoded.
export interface DashboardStats {
  totalCandidates: number;
  openRoles: number;
  closedRoles: number;
  // Candidates whose current stage is this one. Sums to totalCandidates.
  currentByStage: Record<Stage, number>;
  // Distinct candidates who have ever entered this stage, from stage_change
  // history unioned with the current stage. A candidate counts in every stage
  // they passed through, so this does NOT sum to totalCandidates.
  reachedByStage: Record<Stage, number>;
  conversionSteps: DashboardConversionStep[];
  recentActivity: DashboardActivityItem[];
}

// Editable candidate fields. Stage is intentionally excluded — it only moves
// through the transactional stage RPC so event history can't drift.
export interface CandidateFormData {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  current_company: string | null;
  experience_years: number | null;
  skills: string[];
  resume_summary: string | null;
  source: string;
  job_id: string | null;
}
