import { cn } from "@/lib/utils";

// Skeleton row used by the candidate list loading state. The single column
// count keeps it honest on mobile — it mirrors the desktop table shape
// without pretending to know the final column widths.
export function CandidateRowSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
    >
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
      <div className="min-w-0 flex-1">
        <div className="h-3 w-40 rounded bg-muted" />
        <div className="mt-1.5 h-2.5 w-56 rounded bg-muted/70" />
      </div>
      <div className="hidden h-5 w-20 rounded-full bg-muted md:block" />
      <div className="hidden h-3 w-16 rounded bg-muted/70 lg:block" />
      <div className="hidden h-3 w-14 rounded bg-muted/70 sm:block" />
    </div>
  );
}

export function CandidateListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading candidates"
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-4 border-b border-border bg-subtle px-4 py-2.5">
        <div className="h-2.5 w-16 rounded bg-muted" />
        <div className="h-2.5 w-24 rounded bg-muted" />
        <div className="hidden h-2.5 w-16 rounded bg-muted md:block" />
        <div className="hidden h-2.5 w-20 rounded bg-muted lg:block" />
        <div className="hidden h-2.5 w-14 rounded bg-muted sm:block" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <CandidateRowSkeleton key={i} />
      ))}
    </div>
  );
}

// Profile skeleton shared by loading.tsx and the page's Suspense fallback so
// the two can't drift from the real layout: back link, full-width summary,
// then actions on the left and activity on the right.
export function CandidateProfileSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading candidate"
      className="flex flex-col gap-4"
    >
      <div className="h-3 w-28 rounded bg-muted" />

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-full bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-5 w-48 rounded bg-muted" />
            <div className="mt-2 h-3 w-64 rounded bg-muted/70" />
          </div>
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <div className="h-2.5 w-16 rounded bg-muted" />
              <div className="mt-1.5 h-3 w-32 rounded bg-muted/70" />
            </div>
          ))}
        </div>

        <div>
          <div className="h-2.5 w-14 rounded bg-muted" />
          <div className="mt-2 flex gap-1.5">
            <div className="h-5 w-16 rounded-full bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-5 w-14 rounded-full bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="h-2.5 w-48 rounded bg-muted/70" />
            <div className="h-1.5 w-full rounded-full bg-muted/70" />
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-7 rounded-md bg-muted/60" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="h-2.5 w-56 rounded bg-muted/70" />
            <div className="h-20 rounded-md bg-muted/60" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="h-3.5 w-20 rounded bg-muted" />
          <div className="mt-4 flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-7 w-7 shrink-0 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-40 rounded bg-muted" />
                  <div className="mt-1.5 h-2.5 w-24 rounded bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mirrors the create/edit form: back link, title, three field sections, and a
// right-aligned action row. Kept at the form's max width.
export function CandidateFormSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading candidate form"
      className="mx-auto flex w-full max-w-3xl flex-col gap-4"
    >
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="h-3 w-28 rounded bg-muted" />
        <div>
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="mt-2 h-3 w-72 max-w-full rounded bg-muted/70" />
        </div>

        {Array.from({ length: 3 }, (_, section) => (
          <div
            key={section}
            className="rounded-lg border border-border bg-card"
          >
            <div className="border-b border-border px-5 py-3">
              <div className="h-3.5 w-24 rounded bg-muted" />
              <div className="mt-1.5 h-2.5 w-48 rounded bg-muted/70" />
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {Array.from({ length: section === 2 ? 3 : 4 }, (_, field) => (
                <div key={field}>
                  <div className="h-2.5 w-20 rounded bg-muted" />
                  <div className="mt-2 h-9 w-full rounded-md bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end gap-2">
          <div className="h-8 w-20 rounded-md bg-muted/60" />
          <div className="h-8 w-32 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

// Matches the candidate list's outer page padding so the header, controls and
// table line up on one grid.
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-4 py-6 md:px-6", className)}>{children}</div>
  );
}
