import Link from "next/link";

import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "Organize jobs",
    copy: "Keep every open role in one list, with its status, department, and location at a glance.",
    linkLabel: "Open jobs",
    href: "/jobs",
    dot: "bg-stage-applied",
  },
  {
    number: "02",
    title: "Find candidates",
    copy: "Search by name, title, company, or skills — then narrow by stage or role.",
    linkLabel: "Browse candidates",
    href: "/candidates",
    dot: "bg-stage-screening",
  },
  {
    number: "03",
    title: "Move candidates forward",
    copy: "Advance people through Applied to Joined with one recorded transition.",
    linkLabel: "Open the interview slate",
    href: "/candidates?stage=interview",
    dot: "bg-stage-interview",
  },
  {
    number: "04",
    title: "Keep the context",
    copy: "Profiles carry the notes and stage history, so every decision has a trail.",
    linkLabel: "See a sample profile",
    href: "/candidates/00000000-0000-4000-8000-000000000101",
    dot: "bg-stage-joined",
  },
] as const;

export function LandingWorkflow() {
  return (
    <section id="workflow" className="scroll-mt-16 border-t border-marketing-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-teal">
            Workflow
          </p>
          <h2 className="mt-3 text-section text-marketing-ink">
            How recruiters use EarlyHire
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-marketing-muted">
            Four steps, one workspace. Each one links straight into the app —
            no slide-ware.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              <div className="flex items-center">
                <span
                  aria-hidden="true"
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", step.dot)}
                />
                {index < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="ml-3 hidden h-px flex-1 bg-marketing-line lg:block"
                  />
                )}
              </div>
              <p className="mt-4 font-mono text-micro font-medium uppercase tracking-widest text-marketing-muted">
                {step.number}
              </p>
              <h3 className="mt-1.5 text-title font-semibold text-marketing-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-marketing-muted">
                {step.copy}
              </p>
              <Link
                href={step.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-marketing-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{step.linkLabel}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
