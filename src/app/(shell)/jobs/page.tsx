import { Suspense } from "react";
import type { Metadata } from "next";

import { listJobs } from "@/lib/queries";
import { PageContainer } from "@/components/candidates/skeletons";
import { JobCreatePanel } from "@/components/jobs/job-create-panel";
import { JobList } from "@/components/jobs/job-list";
import { JobsSkeleton } from "@/components/jobs/jobs-skeleton";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Open roles and their pipelines",
};

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <JobsSkeleton />
        </PageContainer>
      }
    >
      <JobsContent />
    </Suspense>
  );
}

async function JobsContent() {
  const jobs = await listJobs();
  const openCount = jobs.filter((job) => job.status === "open").length;
  const closedCount = jobs.length - openCount;

  return (
    <PageContainer>
      <JobCreatePanel
        openCount={openCount}
        closedCount={closedCount}
        defaultOpen={jobs.length === 0}
      />
      <JobList jobs={jobs} />
    </PageContainer>
  );
}
