"use client";

import * as React from "react";
import { Archive, Loader2, RotateCcw } from "lucide-react";

import { setJobStatus } from "@/lib/actions";
import type { JobStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function JobStatusToggle({
  jobId,
  jobTitle,
  status,
}: {
  jobId: string;
  jobTitle: string;
  status: JobStatus;
}) {
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const next: JobStatus = status === "open" ? "closed" : "open";

  const onToggle = () => {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      try {
        const result = await setJobStatus(jobId, next);
        if (result.status === "success") {
          setNotice(result.message ?? "Role updated.");
        } else {
          setError(result.message ?? "Could not update role.");
        }
      } catch {
        setError(
          "Could not reach the server. Check your connection and try again.",
        );
      }
    });
  };

  const closing = next === "closed";

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggle}
        disabled={pending}
        aria-label={`${closing ? "Close" : "Reopen"} ${jobTitle}`}
      >
        {pending ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : closing ? (
          <Archive aria-hidden="true" className="h-4 w-4" />
        ) : (
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
        )}
        {pending
          ? closing
            ? "Closing…"
            : "Reopening…"
          : closing
            ? "Close role"
            : "Reopen role"}
      </Button>
      <span role="status" className="sr-only">
        {notice ?? ""}
      </span>
      {error && (
        <p
          role="alert"
          className="max-w-52 text-right text-[11px] leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
