"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CandidateProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Couldn&apos;t load this candidate
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Something went wrong while fetching the candidate profile. Try
            again, or go back to the list.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/candidates">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to candidates
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
