export function JobsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading roles"
      className="flex flex-col gap-6"
    >
      <div aria-hidden="true" className="flex items-start justify-between gap-3">
        <div>
          <div className="h-3.5 w-16 rounded bg-muted" />
          <div className="mt-1.5 h-2.5 w-24 rounded bg-muted/70" />
        </div>
        <div className="h-8 w-24 rounded-md bg-muted" />
      </div>

      <div aria-hidden="true">
        <div className="h-2.5 w-20 rounded bg-muted" />
        <div className="mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="h-3.5 w-48 max-w-full rounded bg-muted" />
                <div className="mt-1.5 h-2.5 w-56 max-w-full rounded bg-muted/70" />
              </div>
              <div className="h-5 w-14 rounded-full bg-muted" />
              <div className="h-8 w-24 rounded-md bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
