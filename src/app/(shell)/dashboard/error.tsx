"use client";

import { FormErrorState } from "@/components/forms/form-error-state";

// Every dashboard query goes through unwrapRows(), so a failed or empty
// database response throws and lands here instead of rendering a page of
// zeros that would look like a real pipeline.
export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FormErrorState
      title="Couldn't load the dashboard"
      description="Something went wrong while reading pipeline data. Rather than show a partial or stale view, nothing is displayed. Try again, or continue to the candidate list."
      reset={reset}
      backHref="/candidates"
      backLabel="Back to candidates"
    />
  );
}
