import { Briefcase, Layers, Users } from "lucide-react";

import { StatTile } from "@/components/dashboard/stat-tile";
import { PipelineBreakdown } from "@/components/dashboard/pipeline-breakdown";
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { RecentActivity } from "@/components/dashboard/recent-activity";

import {
  sampleActivityAll,
  sampleCurrentByStage,
  sampleFunnelSteps,
  sampleReachedByStage,
  sampleStats,
} from "@/components/marketing/demo-data";

export function ProductProof() {
  return (
    <section
      id="product"
      className="scroll-mt-16 border-t border-marketing-line bg-marketing-panel"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-micro font-medium uppercase tracking-widest text-marketing-accent">
            Product
          </p>
          <h2 className="mt-3 text-section font-display font-stretch-[104%] text-balance text-marketing-ink">
            See the whole pipeline at once
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-marketing-muted">
            The dashboard is the product: live counts from the workspace,
            stage-by-stage progression, and the latest recruiting activity —
            the same view you get after you open the app.
          </p>
        </div>

        {/* Real StatTiles, linking into the real routes. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Total candidates"
            value={sampleStats.totalCandidates}
            hint="In the sample workspace"
            href="/candidates"
            icon={Users}
          />
          <StatTile
            label="Open roles"
            value={sampleStats.openRoles}
            hint={`${sampleStats.closedRoles} closed`}
            href="/jobs"
            icon={Briefcase}
          />
          <StatTile
            label="Active candidates"
            value={sampleStats.activeCandidates}
            hint="Not rejected or joined"
            href="/candidates"
            icon={Layers}
          />
        </div>

        {/* The real dashboard components, on the seeded demo numbers. */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PipelineBreakdown
              currentByStage={sampleCurrentByStage}
              reachedByStage={sampleReachedByStage}
              totalCandidates={sampleStats.totalCandidates}
            />
          </div>
          <div className="lg:col-span-5">
            <ConversionFunnel
              steps={sampleFunnelSteps}
              rejectedCount={sampleStats.rejectedCount}
              totalCandidates={sampleStats.totalCandidates}
            />
          </div>
        </div>

        <div className="mt-6">
          <RecentActivity items={sampleActivityAll} />
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-marketing-muted">
          This preview mirrors the seeded sample workspace that ships with the
          demo — the same numbers appear when you open the dashboard.
        </p>
      </div>
    </section>
  );
}
