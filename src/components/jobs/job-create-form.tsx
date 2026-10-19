"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Plus,
} from "lucide-react";

import { createJob } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  FormField,
  fieldAria,
  fieldInputClass,
  fieldSelectClass,
} from "@/components/ui/form-field";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

type JobFormValues = {
  title: string;
  department: string;
  location: string;
  employment_type: (typeof EMPLOYMENT_TYPES)[number];
};

const EMPTY_JOB_VALUES: JobFormValues = {
  title: "",
  department: "",
  location: "",
  employment_type: "Full-time",
};

export function JobCreateForm({ onCancel }: { onCancel: () => void }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = React.useState(false);
  const [values, setValues] = React.useState<JobFormValues>(EMPTY_JOB_VALUES);

  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (previous, formData) => {
    const result = await createJob(previous, formData);
    // Clear after a committed create. On validation errors the controlled
    // values stay put so one field can be corrected instead of retyped.
    if (result.status === "success") setValues(EMPTY_JOB_VALUES);
    return result;
  }, null);

  // Move focus to the first invalid field after a rejection.
  React.useEffect(() => {
    if (state?.status === "error") {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    }
  }, [state]);

  const errorFor = (key: string) =>
    state?.status === "error" ? state.fieldErrors?.[key]?.[0] : undefined;

  const hasFieldErrors =
    state?.status === "error" &&
    Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0);
  const generalError =
    state?.status === "error" && !hasFieldErrors
      ? (state?.message ?? "Could not create role.")
      : null;

  const titleError = errorFor("title");
  const departmentError = errorFor("department");
  const locationError = errorFor("location");
  const typeError = errorFor("employment_type");

  const showNotice =
    state?.status === "success" && !pending && !dirty;

  const bind = (key: keyof JobFormValues) => ({
    value: values[key],
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <section
      aria-labelledby="new-role-heading"
      className="mt-4 rounded-lg border border-border bg-card shadow-xs"
    >
      <div className="border-b border-border px-5 py-3">
        <h3 id="new-role-heading" className="text-sm font-semibold text-foreground">
          New role
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Roles start open and can be closed or reopened at any time.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        noValidate
        onChange={() => setDirty(true)}
        onSubmit={() => setDirty(false)}
        className="flex flex-col"
      >
        {generalError && (
          <div
            role="alert"
            className="mx-5 mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-foreground"
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive"
            />
            {generalError}
          </div>
        )}

        {showNotice && (
          <p
            role="status"
            className="mx-5 mt-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-xs text-foreground"
          >
            <Check aria-hidden="true" className="h-3.5 w-3.5 text-success" />
            {state?.message ?? "Role created."}
          </p>
        )}

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <FormField
            id="job-title"
            label="Role title"
            required
            className="sm:col-span-2"
            error={titleError}
          >
            <input
              id="job-title"
              name="title"
              autoComplete="off"
              placeholder="e.g. Senior Backend Engineer"
              className={fieldInputClass}
              {...bind("title")}
              {...fieldAria("job-title", { required: true, error: titleError })}
            />
          </FormField>

          <FormField
            id="job-department"
            label="Department"
            error={departmentError}
          >
            <input
              id="job-department"
              name="department"
              autoComplete="organization"
              placeholder="e.g. Engineering"
              className={fieldInputClass}
              {...bind("department")}
              {...fieldAria("job-department", { error: departmentError })}
            />
          </FormField>

          <FormField id="job-location" label="Location" error={locationError}>
            <input
              id="job-location"
              name="location"
              autoComplete="address-level2"
              placeholder="e.g. Remote"
              className={fieldInputClass}
              {...bind("location")}
              {...fieldAria("job-location", { error: locationError })}
            />
          </FormField>

          <FormField
            id="job-employment-type"
            label="Employment type"
            required
            className="sm:col-span-2"
            error={typeError}
          >
            <select
              id="job-employment-type"
              name="employment_type"
              className={fieldSelectClass}
              {...bind("employment_type")}
              {...fieldAria("job-employment-type", {
                required: true,
                error: typeError,
              })}
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="h-4 w-4" />
            )}
            {pending ? "Creating…" : "Create role"}
          </Button>
        </div>
      </form>
    </section>
  );
}
