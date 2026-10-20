import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Wordmark } from "@/components/marketing/wordmark";

const GITHUB_URL = "https://github.com/karthikeya1220/earlyhire-ats";

const PRODUCT_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// The route color key — all seven stage hues as a full-bleed strip along
// the foot of the band, like a transit line legend. Decorative.
const ROUTE_KEY = [
  "bg-stage-applied",
  "bg-stage-screening",
  "bg-stage-shortlisted",
  "bg-stage-interview",
  "bg-stage-offer",
  "bg-stage-joined",
  "bg-stage-rejected",
] as const;

export function LandingCta() {
  return (
    <section className="border-t border-marketing-line bg-marketing-band text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-section font-display font-stretch-[105%] text-balance text-white">
            Bring your recruiting workflow into focus.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            EarlyHire keeps roles, candidates, stages, and activity in one
            focused workspace — clear enough to pick up between meetings.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="mk-flat mk-cta-invert focus-visible:ring-white"
            >
              <Link href="/dashboard">Open EarlyHire ATS</Link>
            </Button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="flex h-1.5 w-full">
        {ROUTE_KEY.map((stageClass) => (
          <span key={stageClass} className={`flex-1 ${stageClass}`} />
        ))}
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-marketing-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className={focusRing}>
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-marketing-muted">
              A recruiter-first mini applicant tracking system: roles,
              candidates, stages, and activity in one focused workspace.
            </p>
          </div>

          <nav aria-label="Footer" className="md:justify-self-center">
            <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-muted">
              Product
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-marketing-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-muted">
              Project
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a
                  href={GITHUB_URL}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-marketing-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  GitHub repository
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-marketing-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open the demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-marketing-line pt-6 text-xs text-marketing-muted sm:flex-row sm:items-center sm:justify-between">
          <p>EarlyHire ATS — open-source demo seeded with fictional data.</p>
          <p>Built with Next.js, Supabase, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
