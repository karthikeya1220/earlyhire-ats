import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

// Shown when the workspace has no candidates at all. Pipeline, progression and
// activity sections are replaced rather than rendered full of zeros or dashes,
// which would look like failing metrics instead of an empty pipeline.
export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Users aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-sm font-medium text-foreground">
          No pipeline data yet
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Once you add candidates, this dashboard will show your pipeline by
          stage, how far candidates progress, and the latest activity.
        </p>
      </div>
      <Button size="sm" asChild>
        <Link href="/candidates/new">
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          Add candidate
        </Link>
      </Button>
    </div>
  );
}
