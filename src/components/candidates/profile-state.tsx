"use client";

import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

// Rendered by not-found.tsx when /candidates/[id] doesn't match a real
// candidate (hand-edited or stale link). Not an error — the list is intact.
export function CandidateNotFoundState() {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-16 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            Candidate not found
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            This candidate may have been removed, or the link is out of date.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/candidates">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to candidates
          </Link>
        </Button>
      </div>
    </div>
  );
}
