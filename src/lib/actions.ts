"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  candidateFiltersToSearchParams,
  parseCandidateSearchParams,
} from "./candidate-filters";
import { STAGE_LABELS } from "./stages";
import { getSupabase } from "./supabase/server";
import type { CandidateFormData } from "./types";
import { isUuid } from "./utils";
import {
  candidateFormSchema,
  jobFormSchema,
  noteFormSchema,
  stageFormSchema,
} from "./validation";

export type ActionStatus = "success" | "error";

export interface ActionResult {
  status: ActionStatus;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

function fieldErrorsFromZod(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

function revalidateAll(candidateId?: string): void {
  revalidatePath("/");
  revalidatePath("/candidates");
  if (candidateId) revalidatePath(`/candidates/${candidateId}`);
}

// Rebuild the list context from the hidden return-query field. Only the three
// known filters survive, so a crafted value can't inject another destination.
function filtersFromReturnQuery(raw: string) {
  const params = new URLSearchParams(raw.startsWith("?") ? raw.slice(1) : raw);
  return parseCandidateSearchParams({
    q: params.get("q") ?? undefined,
    stage: params.get("stage") ?? undefined,
    job: params.get("job") ?? undefined,
  });
}

type JobAssignmentCheck =
  | { ok: true }
  | { ok: false; message: string; fieldError: boolean };

// A closed role is never a valid *new* assignment. Keeping a candidate's
// existing closed role is allowed so editing other fields doesn't force an
// unrelated reassignment.
async function validateJobAssignment(
  jobId: string | null,
  currentJobId: string | null,
): Promise<JobAssignmentCheck> {
  if (!jobId) return { ok: true };

  const supabase = getSupabase();
  const { data: job, error } = await supabase
    .from("ats_jobs")
    .select("id,status")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: `Could not verify the selected role: ${error.message}`,
      fieldError: false,
    };
  }
  if (!job) {
    return {
      ok: false,
      message: "Selected role no longer exists.",
      fieldError: true,
    };
  }
  if (job.status === "closed" && job.id !== currentJobId) {
    return {
      ok: false,
      message:
        "This role is closed. Choose an open role or leave the candidate unassigned.",
      fieldError: true,
    };
  }

  return { ok: true };
}

export async function createCandidate(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = candidateFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data: CandidateFormData = parsed.data;
  const jobCheck = await validateJobAssignment(data.job_id, null);
  if (!jobCheck.ok) {
    return jobCheck.fieldError
      ? {
          status: "error",
          message: "Fix the errors below.",
          fieldErrors: { job_id: [jobCheck.message] },
        }
      : { status: "error", message: jobCheck.message };
  }

  const supabase = getSupabase();
  const { data: created, error } = await supabase
    .from("ats_candidates")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      current_title: data.current_title,
      current_company: data.current_company,
      experience_years: data.experience_years,
      skills: data.skills,
      resume_summary: data.resume_summary,
      source: data.source,
      // New candidates always enter at applied; stage is never taken from the
      // form, so creation and history start from the same state.
      stage: "applied",
      job_id: data.job_id,
    })
    .select("id")
    .single();

  if (error || !created) {
    const message = error?.message ?? "the database returned no row";
    console.error("createCandidate insert failed:", message);
    return { status: "error", message: `Could not create candidate: ${message}` };
  }

  // Record the real pipeline entry. If this secondary write fails, the
  // candidate still exists; the profile's empty timeline stays honest.
  const { error: eventError } = await supabase.from("ats_events").insert({
    candidate_id: created.id,
    kind: "stage_change",
    to_stage: "applied",
  });
  if (eventError) {
    console.error("createCandidate initial event failed:", eventError.message);
  }

  revalidateAll(created.id);

  const returnQuery = formData.get("returnQuery");
  const filters = filtersFromReturnQuery(
    typeof returnQuery === "string" ? returnQuery : "",
  );
  const query = candidateFiltersToSearchParams(filters).toString();
  // redirect must stay outside try/catch; it communicates via a thrown result.
  redirect(`/candidates/${created.id}${query ? `?${query}` : ""}`);
}

export async function updateCandidate(
  candidateId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isUuid(candidateId)) {
    return { status: "error", message: "Candidate not found." };
  }

  const parsed = candidateFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data: CandidateFormData = parsed.data;
  const supabase = getSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("ats_candidates")
    .select("id,job_id")
    .eq("id", candidateId)
    .maybeSingle();

  if (existingError) {
    console.error("updateCandidate lookup failed:", existingError.message);
    return { status: "error", message: `Could not update candidate: ${existingError.message}` };
  }
  if (!existing) {
    return { status: "error", message: "Candidate not found." };
  }

  const jobCheck = await validateJobAssignment(data.job_id, existing.job_id);
  if (!jobCheck.ok) {
    return jobCheck.fieldError
      ? {
          status: "error",
          message: "Fix the errors below.",
          fieldErrors: { job_id: [jobCheck.message] },
        }
      : { status: "error", message: jobCheck.message };
  }

  // Stage is intentionally absent: editing details must not bypass the
  // transactional stage RPC or create history that disagrees with the stage.
  const { data: updated, error } = await supabase
    .from("ats_candidates")
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      current_title: data.current_title,
      current_company: data.current_company,
      experience_years: data.experience_years,
      skills: data.skills,
      resume_summary: data.resume_summary,
      source: data.source,
      job_id: data.job_id,
    })
    .eq("id", candidateId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("updateCandidate failed:", error.message);
    return { status: "error", message: `Could not update candidate: ${error.message}` };
  }
  if (!updated) {
    return { status: "error", message: "Candidate not found." };
  }

  revalidateAll(candidateId);
  return { status: "success", message: "Changes saved." };
}

export async function changeStage(
  candidateId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isUuid(candidateId)) {
    return { status: "error", message: "Candidate not found." };
  }

  const parsed = stageFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = getSupabase();
  const { error } = await supabase.rpc("ats_change_candidate_stage", {
    p_candidate_id: candidateId,
    p_new_stage: parsed.data.stage,
    p_note: parsed.data.note ?? null,
  });

  if (error) {
    console.error("changeStage rpc failed:", error.message);
    return { status: "error", message: `Could not change stage: ${error.message}` };
  }

  revalidateAll(candidateId);
  return {
    status: "success",
    message: `Stage moved to ${STAGE_LABELS[parsed.data.stage]}.`,
  };
}

export async function addNote(
  candidateId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isUuid(candidateId)) {
    return { status: "error", message: "Candidate not found." };
  }

  const parsed = noteFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("ats_events").insert({
    candidate_id: candidateId,
    kind: "note",
    body: parsed.data.body,
  });

  if (error) {
    console.error("addNote insert failed:", error.message);
    return { status: "error", message: `Could not add note: ${error.message}` };
  }

  revalidateAll(candidateId);
  return { status: "success", message: "Note added." };
}

export async function createJob(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = jobFormSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = getSupabase();
  const { data: created, error } = await supabase
    .from("ats_jobs")
    .insert({
      title: parsed.data.title,
      department: parsed.data.department,
      location: parsed.data.location,
      employment_type: parsed.data.employment_type,
    })
    .select("id")
    .single();

  if (error || !created) {
    const message = error?.message ?? "the database returned no row";
    console.error("createJob insert failed:", message);
    return { status: "error", message: `Could not create role: ${message}` };
  }

  revalidatePath("/jobs");
  revalidatePath("/candidates");
  revalidatePath("/");
  return { status: "success", message: "Role created." };
}

export async function setJobStatus(
  jobId: string,
  status: "open" | "closed",
): Promise<ActionResult> {
  if (!isUuid(jobId)) {
    return { status: "error", message: "Role not found." };
  }
  if (status !== "open" && status !== "closed") {
    return { status: "error", message: "Invalid role status." };
  }

  const supabase = getSupabase();
  const { data: updated, error } = await supabase
    .from("ats_jobs")
    .update({ status })
    .eq("id", jobId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("setJobStatus failed:", error.message);
    return { status: "error", message: `Could not update role: ${error.message}` };
  }
  if (!updated) {
    return { status: "error", message: "Role not found." };
  }

  revalidatePath("/jobs");
  revalidatePath("/");
  revalidatePath("/candidates");
  return {
    status: "success",
    message: status === "open" ? "Role reopened." : "Role closed.",
  };
}
