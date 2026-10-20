import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ActivityCompact } from "@/components/marketing/activity-compact";
import { sampleActivityHero, sampleStats } from "@/components/marketing/demo-data";
import { PipelineCompact } from "@/components/marketing/pipeline-compact";
import { ProductWindow } from "@/components/marketing/product-window";

export function LandingHero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <div className="marketing-rise flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-marketing-accent" />
              <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-accent">
                Recruiter-first ATS
              </p>
            </div>

            <h1
              className="marketing-rise mt-5 text-hero font-display font-stretch-[105%] text-balance text-marketing-ink"
              style={{ animationDelay: "60ms" }}
            >
              <span className="block">Every candidate.</span>
              <span className="block">A clearer path to the right hire.</span>
            </h1>

            <p
              className="marketing-rise mt-6 max-w-xl text-lg leading-relaxed text-marketing-muted"
              style={{ animationDelay: "120ms" }}
            >
              EarlyHire brings job openings, candidate pipelines, and recruiting
              activity into one focused workspace — clear enough to pick up
              between meetings.
            </p>

            <div
              className="marketing-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "180ms" }}
            >
              <Button asChild size="lg" className="mk-flat mk-cta">
                <Link href="/dashboard">Explore the ATS</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="mk-flat">
                <Link href="#workflow">See How It Works</Link>
              </Button>
            </div>

            <p
              className="marketing-rise mt-6 font-mono text-micro uppercase tracking-widest text-marketing-muted"
              style={{ animationDelay: "220ms" }}
            >
              Seeded demo included · no signup
            </p>
          </div>

          <div
            className="min-w-0 lg:col-span-6"
            style={{ animationDelay: "150ms" }}
          >
            <div className="marketing-rise">
              <ProductWindow label="earlyhire.app — dashboard">
                <div className="px-4 py-4 sm:px-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="text-micro font-medium uppercase text-muted-foreground">
                        Dashboard
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {sampleStats.totalCandidates} candidates ·{" "}
                        {sampleStats.openRoles} open roles
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-lg border border-border">
                    <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle/60 px-4 py-1.5">
                      <span className="text-micro font-medium uppercase text-muted-foreground">
                        Stage
                      </span>
                      <span className="text-micro font-medium uppercase text-muted-foreground">
                        Now · Ever
                      </span>
                    </div>
                    <PipelineCompact />
                  </div>

                  <p className="mt-4 text-micro font-medium uppercase text-muted-foreground">
                    Recent activity
                  </p>
                  <div className="mt-1.5 overflow-hidden rounded-lg border border-border">
                    <ActivityCompact items={sampleActivityHero} />
                  </div>
                </div>
              </ProductWindow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
