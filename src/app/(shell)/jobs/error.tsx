"use client";

import { FormErrorState } from "@/components/forms/form-error-state";

export default function JobsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FormErrorState
      title="Couldn't load roles"
      description="Something went wrong while fetching roles and their status. Try again, or return to the dashboard."
      reset={reset}
      backHref="/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
