import { cn } from "@/lib/utils";

// Three ascending bars in a chip — the pipeline, ending on the tallest bar in
// the signal accent. Fills follow the marketing tokens, so the mark inverts
// cleanly when the closing CTA sits on the band.
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 22 22"
        className="h-[22px] w-[22px] shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="20"
          height="20"
          rx="4.5"
          className="fill-marketing-ink"
        />
        <rect
          x="5"
          y="13"
          width="3"
          height="4"
          rx="1"
          className="fill-marketing-bg"
          opacity="0.55"
        />
        <rect
          x="9.5"
          y="9.5"
          width="3"
          height="7.5"
          rx="1"
          className="fill-marketing-bg"
          opacity="0.8"
        />
        <rect x="14" y="5" width="3" height="12" rx="1" className="fill-marketing-accent" />
      </svg>
      <span className="text-sm font-semibold tracking-tight text-marketing-ink">
        EarlyHire
      </span>
      {" "}
      <span className="pt-px font-mono text-micro font-medium uppercase tracking-widest text-marketing-muted">
        ATS
      </span>
    </span>
  );
}
