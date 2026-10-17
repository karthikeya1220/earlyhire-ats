"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Save,
  UserPlus,
} from "lucide-react";

import { createCandidate, updateCandidate } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";
import { STAGE_LABELS, type Stage } from "@/lib/stages";
import { Button } from "@/components/ui/button";
import {
  FormField,
  fieldAria,
  fieldInputClass,
  fieldSelectClass,
  fieldTextareaClass,
} from "@/components/ui/form-field";
import { StageBadge } from "@/components/candidates/stage-badge";

const SOURCE_OPTIONS = [
  "Direct",
  "Referral",
  "LinkedIn",
  "Careers page",
  "Dribbble",
];

export interface CandidateFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  current_title: string;
  current_company: string;
  experience_years: string;
  skills: string;
  resume_summary: string;
  source: string;
  job_id: string;
}

export interface JobOption {
  id: string;
  title: string;
  status: "open" | "closed";
}

const EMPTY_VALUES: CandidateFormValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  current_title: "",
  current_company: "",
  experience_years: "",
  skills: "",
  resume_summary: "",
  source: "Direct",
  job_id: "",
};

interface SharedFormProps {
  openJobs: JobOption[];
  closedCurrentJob?: JobOption | null;
  filterSuffix: string;
  backHref: string;
  cancelHref: string;
}

type CandidateFormProps =
  | (SharedFormProps & {
      mode: "create";
      initial?: CandidateFormValues;
      currentStage?: undefined;
    })
  | (SharedFormProps & {
      mode: "edit";
      candidateId: string;
      initial: CandidateFormValues;
      currentStage: Stage;
    });

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function CandidateForm(props: CandidateFormProps) {
  const { mode, openJobs, closedCurrentJob, filterSuffix, backHref, cancelHref } =
    props;
  const [values, setValues] = React.useState<CandidateFormValues>(
    props.initial ?? EMPTY_VALUES,
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = React.useState(false);
  const candidateId = mode === "edit" ? props.candidateId : null;

  const action = React.useMemo(() => {
    if (candidateId) return updateCandidate.bind(null, candidateId);
    return createCandidate;
  }, [candidateId]);

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  React.useEffect(() => {
    if (state?.status !== "error") return;
    // Take keyboard/screen-reader users to the first field that failed.
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [state]);

  const errorFor = (key: string) =>
    state?.status === "error" ? state.fieldErrors?.[key]?.[0] : undefined;

  const hasFieldErrors =
    state?.status === "error" &&
    Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0);
  const generalError =
    state?.status === "error" && !hasFieldErrors
      ? (state.message ?? "Could not save this candidate.")
      : null;
  const showSuccess =
    mode === "edit" && state?.status === "success" && !pending && !dirty;

  const jobOptions = React.useMemo(() => {
    const options = openJobs.map((job) => ({ ...job, closed: false }));
    if (
      closedCurrentJob &&
      !options.some((job) => job.id === closedCurrentJob.id)
    ) {
      options.push({ ...closedCurrentJob, closed: true });
    }
    return options;
  }, [openJobs, closedCurrentJob]);

  const nameError = errorFor("name");
  const emailError = errorFor("email");
  const phoneError = errorFor("phone");
  const locationError = errorFor("location");
  const titleError = errorFor("current_title");
  const companyError = errorFor("current_company");
  const experienceError = errorFor("experience_years");
  const sourceError = errorFor("source");
  const jobError = errorFor("job_id");
  const skillsError = errorFor("skills");
  const summaryError = errorFor("resume_summary");

  const stage: Stage = mode === "edit" ? props.currentStage : "applied";

  // React resets uncontrolled fields after a form action, including failed
  // validation. Controlled fields keep what the user typed so they can fix the
  // reported error instead of re-entering the whole form.
  const bind = (key: keyof CandidateFormValues) => ({
    value: values[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onChange={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
      className="flex w-full flex-col gap-4"
    >
      {mode === "create" && (
        <input type="hidden" name="returnQuery" value={filterSuffix} />
      )}

      {generalError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
          />
          <span>{generalError}</span>
        </div>
      )}

      {showSuccess && (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-center gap-2 text-sm text-foreground">
            <Check aria-hidden="true" className="h-4 w-4 text-success" />
            {state?.message ?? "Changes saved."}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={backHref}>View profile</Link>
          </Button>
        </div>
      )}

      <Section title="Contact" description="How to reach this candidate.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="name" label="Full name" required error={nameError}>
            <input
              id="name"
              name="name"
              autoComplete="name"
              className={fieldInputClass}
              {...bind("name")}
              {...fieldAria("name", { required: true, error: nameError })}
            />
          </FormField>

          <FormField id="email" label="Email" required error={emailError}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldInputClass}
              {...bind("email")}
              {...fieldAria("email", { required: true, error: emailError })}
            />
          </FormField>

          <FormField id="phone" label="Phone" error={phoneError}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldInputClass}
              {...bind("phone")}
              {...fieldAria("phone", { error: phoneError })}
            />
          </FormField>

          <FormField id="location" label="Location" error={locationError}>
            <input
              id="location"
              name="location"
              autoComplete="address-level2"
              className={fieldInputClass}
              {...bind("location")}
              {...fieldAria("location", { error: locationError })}
            />
          </FormField>
        </div>
      </Section>

      <Section
        title="Profile"
        description="Current role, experience, and how they found you."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="current_title"
            label="Current title"
            error={titleError}
          >
            <input
              id="current_title"
              name="current_title"
              autoComplete="organization-title"
              className={fieldInputClass}
              {...bind("current_title")}
              {...fieldAria("current_title", { error: titleError })}
            />
          </FormField>

          <FormField
            id="current_company"
            label="Current company"
            error={companyError}
          >
            <input
              id="current_company"
              name="current_company"
              autoComplete="organization"
              className={fieldInputClass}
              {...bind("current_company")}
              {...fieldAria("current_company", { error: companyError })}
            />
          </FormField>

          <FormField
            id="experience_years"
            label="Experience (years)"
            hint="Whole years, 0–60. Leave blank if unknown."
            error={experienceError}
          >
            <input
              id="experience_years"
              name="experience_years"
              type="number"
              inputMode="numeric"
              min={0}
              max={60}
              step={1}
              className={fieldInputClass}
              {...bind("experience_years")}
              {...fieldAria("experience_years", {
                hint: true,
                error: experienceError,
              })}
            />
          </FormField>

          <FormField id="source" label="Source" required error={sourceError}>
            <input
              id="source"
              name="source"
              list="candidate-sources"
              className={fieldInputClass}
              {...bind("source")}
              {...fieldAria("source", { required: true, error: sourceError })}
            />
            <datalist id="candidate-sources">
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source} />
              ))}
            </datalist>
          </FormField>
        </div>
      </Section>

      <Section
        title="Role and skills"
        description="Assign an open role and capture the skills that matter."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="job_id"
            label="Role"
            className="sm:col-span-2"
            hint={
              <>
                Only open roles can be newly assigned.{" "}
                {closedCurrentJob
                  ? "This candidate's current role is closed; you can keep it or choose an open role. "
                  : ""}
                {openJobs.length === 0 && (
                  <>
                    No open roles —{" "}
                    <Link
                      href="/jobs"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      create one
                    </Link>
                    .
                  </>
                )}
              </>
            }
            error={jobError}
          >
            <select
              id="job_id"
              name="job_id"
              className={fieldSelectClass}
              {...bind("job_id")}
              {...fieldAria("job_id", { hint: true, error: jobError })}
            >
              <option value="">Unassigned</option>
              {jobOptions.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                  {job.closed ? " (closed)" : ""}
                </option>
              ))}
            </select>
          </FormField>

          <div className="rounded-md border border-border bg-subtle p-3 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <StageBadge stage={stage} />
                <p className="text-xs text-muted-foreground">
                  {mode === "create"
                    ? "New candidates start here; move stages from their profile."
                    : "Stage changes are recorded from the candidate profile."}
                </p>
              </div>
              {mode === "edit" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={backHref}>Manage stage</Link>
                </Button>
              )}
            </div>
          </div>

          <FormField
            id="skills"
            label="Skills"
            className="sm:col-span-2"
            hint="Comma-separated, up to 40 skills."
            error={skillsError}
          >
            <input
              id="skills"
              name="skills"
              placeholder="React, TypeScript, Design Systems"
              className={fieldInputClass}
              {...bind("skills")}
              {...fieldAria("skills", { hint: true, error: skillsError })}
            />
          </FormField>
        </div>
      </Section>

      <Section
        title="Resume summary"
        description="A short, recruiter-readable summary shown on the profile."
      >
        <FormField id="resume_summary" label="Summary" error={summaryError}>
          <textarea
            id="resume_summary"
            name="resume_summary"
            rows={5}
            placeholder="Highlights, scope, and anything the hiring panel should know."
            className={fieldTextareaClass}
            {...bind("resume_summary")}
            {...fieldAria("resume_summary", { error: summaryError })}
          />
        </FormField>
      </Section>

      <div className="flex flex-col-reverse gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground">
          {mode === "create"
            ? "The candidate starts in Applied."
            : `Currently ${STAGE_LABELS[stage]}.`}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : mode === "create" ? (
              <UserPlus aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Save aria-hidden="true" className="h-4 w-4" />
            )}
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create candidate"
                : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
