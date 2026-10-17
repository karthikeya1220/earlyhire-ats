import { z } from "zod";

import { STAGES } from "./stages";

const stageEnum = z.enum(STAGES);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

const skillsFromForm = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  .pipe(z.array(z.string().trim().min(1).max(60)).max(40));

// `stage` is deliberately absent. New candidates always enter at `applied` and
// existing stages only move through ats_change_candidate_stage, which writes
// history atomically. A plain update here must never change stage.
export const candidateFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254)
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Enter a valid email address",
    }),
  phone: optionalText(30),
  location: optionalText(120),
  current_title: optionalText(160),
  current_company: optionalText(160),
  // Empty form values must become null, not 0. `z.coerce.number()` alone
  // coerces "" to 0, which would silently invent experience.
  experience_years: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.coerce
      .number()
      .int("Experience must be a whole number")
      .min(0, "Experience must be 0 or more")
      .max(60, "Experience must be 60 or less")
      .nullable(),
  ),
  skills: skillsFromForm,
  resume_summary: optionalText(4000),
  source: z.string().trim().min(1, "Source is required").max(80),
  // The unassigned option submits "". Validate after normalising it to null so
  // an empty select isn't reported as an invalid uuid.
  job_id: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.string().uuid("Select a valid role").nullable(),
  ),
});

export type CandidateFormInput = z.infer<typeof candidateFormSchema>;

export const stageFormSchema = z.object({
  stage: stageEnum,
  note: z.string().trim().max(4000).optional(),
});

export const noteFormSchema = z.object({
  body: z.string().trim().min(1, "Note cannot be empty").max(4000),
});

export const jobFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  department: optionalText(120),
  location: optionalText(120),
  employment_type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
});
