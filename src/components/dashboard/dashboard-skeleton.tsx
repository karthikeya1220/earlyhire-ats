// Mirrors the dashboard: heading, three summary tiles, pipeline + progression
// cards (wider first), then the activity list.
export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      className="flex flex-col gap-4"
    >
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div>
          <div className="h-3.5 w-32 rounded bg-muted" />
          <div className="mt-2 h-2.5 w-72 max-w-full rounded bg-muted/70" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="h-2.5 w-20 rounded bg-muted" />
                <div className="mt-2 h-6 w-12 rounded bg-muted/70" />
                <div className="mt-2 h-2.5 w-24 rounded bg-muted/60" />
              </div>
              <div className="h-8 w-8 shrink-0 rounded-md bg-muted/60" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-card lg:col-span-3">
            <div className="border-b border-border px-5 py-3">
              <div className="h-3.5 w-32 rounded bg-muted" />
              <div className="mt-2 h-2.5 w-64 max-w-full rounded bg-muted/70" />
            </div>
            <div className="flex flex-col">
              {Array.from({ length: 7 }, (_, index) => (
                <div
                  key={index}
                  className="border-b border-border px-5 py-3 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-5 w-20 rounded-full bg-muted" />
                    <div className="h-2.5 w-24 rounded bg-muted/70" />
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card lg:col-span-2">
            <div className="border-b border-border px-5 py-3">
              <div className="h-3.5 w-32 rounded bg-muted" />
              <div className="mt-2 h-2.5 w-48 rounded bg-muted/70" />
            </div>
            <div className="flex flex-col">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="border-b border-border px-5 py-3 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-2.5 w-36 rounded bg-muted/70" />
                    <div className="h-3.5 w-10 rounded bg-muted" />
                  </div>
                  <div className="mt-2 h-2.5 w-48 rounded bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <div className="h-3.5 w-28 rounded bg-muted" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex gap-3 px-5 py-3">
                <div className="h-7 w-7 shrink-0 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-52 max-w-full rounded bg-muted/70" />
                  <div className="mt-2 h-2.5 w-24 rounded bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
