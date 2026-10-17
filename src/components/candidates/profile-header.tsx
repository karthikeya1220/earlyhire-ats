import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProfileHeader({
  backHref,
  editHref,
}: {
  backHref: string;
  editHref: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        Back to candidates
      </Link>
      <Button variant="outline" size="sm" asChild>
        <Link href={editHref}>
          <Pencil aria-hidden="true" className="h-4 w-4" />
          Edit candidate
        </Link>
      </Button>
    </div>
  );
}
