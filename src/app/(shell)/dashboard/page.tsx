import { Suspense } from "react";
import type { Metadata } from "next";
import { Briefcase, Layers, Users } from "lucide-react";

import { getDashboardStats, isActiveStage } from "@/lib/queries";
import { STAGES } from "@/lib/stages";
import { PageContainer } from "@/components/candidates/skeletons";
import { StatTile } from "@/components/dashboard/stat-tile";
import { PipelineBreakdown } from "@/components/dashboard/pipeline-breakdown";
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Pipeline overview and hiring health",
};

// Wrapper stays sync and the data work sits behind Suspense, matching the
// candidates/jobs routes: the shell prerenders, and the counts stream in at
// request time so a build never bakes in a stale snapshot.
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <DashboardSkeleton />
        </PageContainer>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  // "Active" uses the same definition as the rest of the app (applied through
  // offer), so it excludes joined and rejected candidates.
  const activeCount = STAGES.filter(isActiveStage).reduce(
    (sum, stage) => sum + stats.currentByStage[stage],
    0,
  );
  const hasPipelineData = stats.totalCandidates > 0;

  return (
    <PageContainer className="flex flex-col gap-4">
      <div>
        <h2 className="text-title text-foreground">
          Pipeline overview
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Live counts from your candidates, roles, and stage history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="Total candidates"
          value={stats.totalCandidates}
          hint="Everyone in the workspace"
          href="/candidates"
          icon={Users}
        />
        <StatTile
          label="Open roles"
          value={stats.openRoles}
          hint={`${stats.closedRoles} closed`}
          href="/jobs"
          icon={Briefcase}
        />
        <StatTile
          label="Active pipeline"
          value={activeCount}
          hint="Applied through Offer"
          icon={Layers}
        />
      </div>

      {hasPipelineData ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-3">
              <PipelineBreakdown
                currentByStage={stats.currentByStage}
                reachedByStage={stats.reachedByStage}
                totalCandidates={stats.totalCandidates}
              />
            </div>
            <div className="min-w-0 lg:col-span-2">
              <ConversionFunnel
                steps={stats.conversionSteps}
                rejectedCount={stats.currentByStage.rejected}
                totalCandidates={stats.totalCandidates}
              />
            </div>
          </div>
          <RecentActivity items={stats.recentActivity} />
        </>
      ) : (
        <DashboardEmptyState />
      )}
    </PageContainer>
  );
}
