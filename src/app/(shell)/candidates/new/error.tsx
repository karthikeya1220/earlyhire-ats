"use client";

import { FormErrorState } from "@/components/forms/form-error-state";

export default function NewCandidateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FormErrorState
      title="Couldn't open the candidate form"
      description="Something went wrong while loading roles for this form. Try again, or go back to the candidate list."
      reset={reset}
      backHref="/candidates"
      backLabel="Back to candidates"
    />
  );
}
