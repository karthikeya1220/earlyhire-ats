import type { Metadata } from "next";

import { listCandidates, listJobs } from "@/lib/queries";
import { parseCandidateSearchParams } from "@/lib/candidate-filters";
import { PageContainer } from "@/components/candidates/skeletons";
import { CandidateList } from "@/components/candidates/candidate-list";

export const metadata: Metadata = {
  title: "Candidates",
  description: "Search, filter, and review candidates in your pipeline",
};

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCandidateSearchParams(params);

  const [candidates, jobs] = await Promise.all([
    listCandidates(filters),
    listJobs(),
  ]);

  return (
    <PageContainer>
      <CandidateList
        candidates={candidates}
        jobs={jobs}
        filters={filters}
        allEmpty={candidates.length === 0 && !filters.q && !filters.stage && !filters.jobId}
      />
    </PageContainer>
  );
}
