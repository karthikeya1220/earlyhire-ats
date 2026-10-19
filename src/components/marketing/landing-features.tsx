import Link from "next/link";
import { Search } from "lucide-react";

import { formatExperience } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StageBadge } from "@/components/candidates/stage-badge";
import {
  STAGE_ACCENT_STYLES,
  STAGE_CHIP_STYLES,
} from "@/components/candidates/stage-badge-styles";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";

import { ActivityCompact } from "@/components/marketing/activity-compact";
import {
  sampleActivityFeatured,
  sampleDiscoveryCandidates,
  sampleJobs,
  sampleProfile,
  sampleStats,
} from "@/components/marketing/demo-data";
import { PipelineCompact } from "@/components/marketing/pipeline-compact";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DiscoveryVisual() {
  return (
    <div className="p-4" aria-hidden="true">
      <div className="flex items-center gap-2 rounded-md border border-border bg-subtle/60 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm text-foreground">frontend</span>
        <span className="ml-auto font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
          {sampleDiscoveryCandidates.length} shown
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["React", "TypeScript", "Next.js"].map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-border bg-subtle px-2 py-0.5 text-xs text-foreground"
          >
            {skill}
          </span>
        ))}
        {(["applied", "screening", "shortlisted"] as const).map((stage) => (
          <span
            key={stage}
            className={cn(
              "rounded-md border px-2 py-0.5 text-xs font-medium",
              STAGE_CHIP_STYLES[stage],
            )}
          >
            {stage === "applied"
              ? "Applied"
              : stage === "screening"
                ? "Screening"
                : "Shortlisted"}
          </span>
        ))}
      </div>
      <ul className="mt-3 divide-y divide-border border-t border-border">
        {sampleDiscoveryCandidates.map((candidate) => (
          <li key={candidate.id} className="flex items-center gap-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-micro font-medium text-foreground">
              {initialsOf(candidate.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {candidate.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {candidate.title} · {candidate.company}
              </p>
            </div>
            <StageBadge stage={candidate.stage} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PipelineVisual() {
  return (
    <div aria-hidden="true">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle/60 px-4 py-2">
        <p className="text-sm font-semibold text-foreground">
          Pipeline by stage
        </p>
        <span className="font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
          Now · Ever
        </span>
      </div>
      <PipelineCompact />
    </div>
  );
}

function ProfileVisual() {
  return (
    <div
      aria-hidden="true"
      className={cn("border-t-2 p-4 sm:p-5", STAGE_ACCENT_STYLES[sampleProfile.stage])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">
            {sampleProfile.name}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {sampleProfile.title} · {sampleProfile.company}
          </p>
        </div>
        <StageBadge stage={sampleProfile.stage} size="md" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {[
          { term: "Role", value: sampleProfile.jobTitle },
          { term: "Source", value: sampleProfile.source },
          {
            term: "Experience",
            value: formatExperience(sampleProfile.experienceYears),
          },
          { term: "Location", value: sampleProfile.location },
        ].map((item) => (
          <div key={item.term}>
            <dt className="font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
              {item.term}
            </dt>
            <dd className="mt-0.5 truncate text-xs text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex gap-1.5 border-t border-border pt-3">
        {["Stage history", "Notes", "Edit"].map((label) => (
          <span
            key={label}
            className="rounded-md border border-border bg-subtle px-2 py-0.5 text-micro font-medium uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ActivityVisual() {
  return (
    <div aria-hidden="true" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle/60 px-4 py-2">
        <p className="shrink-0 text-sm font-semibold text-foreground">Recent activity</p>
        <span className="shrink-0 font-mono text-micro font-medium uppercase tracking-widest text-muted-foreground">
          Timeline
        </span>
      </div>
      <ActivityCompact items={sampleActivityFeatured} />
    </div>
  );
}

function JobsVisual() {
  return (
    <div aria-hidden="true">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle/60 px-4 py-2">
        <p className="text-sm font-semibold text-foreground">Jobs</p>
        <p className="text-xs text-muted-foreground">
          {sampleStats.openRoles} open · {sampleStats.closedRoles} closed
        </p>
      </div>
      <ul className="divide-y divide-border">
        {sampleJobs.map((job) => (
          <li key={job.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {job.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {job.department} · {job.location} · {job.employment_type}
              </p>
            </div>
            <JobStatusBadge status={job.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const FEATURES = [
  {
    number: "01",
    title: "Candidate discovery",
    copy: "Search runs across names, titles, companies, and skills. Stage and role filters sit beside it, so a long applicant list becomes a short, reviewable set.",
    linkLabel: "Search candidates",
    href: "/candidates",
    visual: <DiscoveryVisual />,
  },
  {
    number: "02",
    title: "Pipeline visibility",
    copy: "Every stage shows who sits in it now and who has ever passed through. Bars are the share of the pipeline; the counts stay printed next to them.",
    linkLabel: "Browse by stage",
    href: "/candidates?stage=applied",
    visual: <PipelineVisual />,
  },
  {
    number: "03",
    title: "Candidate profiles",
    copy: "One screen per person: current role, source, experience, and the stage they sit in — with the transition control and notes right underneath.",
    linkLabel: "Open a profile",
    href: `/candidates/${sampleProfile.id}`,
    visual: <ProfileVisual />,
  },
  {
    number: "04",
    title: "Recruiting activity history",
    copy: "Stage changes and notes land in one timeline. When someone asks why a candidate moved, the answer is already written down.",
    linkLabel: "See recent activity",
    href: "/dashboard",
    visual: <ActivityVisual />,
  },
  {
    number: "05",
    title: "Job-level visibility",
    copy: "Open and closed roles carry their own pipelines and filters, so req-level decisions never drown in the global list.",
    linkLabel: "View all jobs",
    href: "/jobs",
    visual: <JobsVisual />,
  },
] as const;

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-t border-marketing-line bg-marketing-panel [overflow-x:clip]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-teal">
            Features
          </p>
          <h2 className="mt-3 text-section text-marketing-ink">
            Built for the way recruiting actually runs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-marketing-muted">
            Each surface answers a question recruiters ask every week — without
            a spreadsheet in the loop.
          </p>
        </div>

        <div className="mt-14 flex max-w-full flex-col gap-16 md:mt-20 md:gap-20">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.number}
              className="grid min-w-0 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
            >
              <div className={`${index % 2 === 1 ? "md:order-2 " : ""}min-w-0`}>
                <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-teal">
                  {feature.number}
                </p>
                <h3 className="mt-2 text-display font-semibold tracking-tight text-marketing-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-marketing-muted">
                  {feature.copy}
                </p>
                <Link
                  href={feature.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-marketing-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{feature.linkLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className={`${index % 2 === 1 ? "md:order-1 " : ""}min-w-0`}>
                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
                  {feature.visual}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
