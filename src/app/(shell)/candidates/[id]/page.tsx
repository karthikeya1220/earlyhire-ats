import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCandidateWithDetails } from "@/lib/queries";
import {
  candidateFilterSuffix,
  candidatesHref,
  parseCandidateSearchParams,
} from "@/lib/candidate-filters";
import {
  CandidateProfileSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";
import { CandidateSummary } from "@/components/candidates/candidate-summary";
import { ProfileHeader } from "@/components/candidates/profile-header";
import { StageTransitionControl } from "@/components/candidates/stage-transition";
import { ActivityTimeline } from "@/components/candidates/activity-timeline";
import { NoteForm } from "@/components/candidates/note-form";

type Params = { params: Promise<{ id: string }> };
type SearchParams = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getCandidateWithDetails(id);
    if (!data) return { title: "Candidate not found" };
    return { title: data.candidate.name };
  } catch {
    return { title: "Candidate" };
  }
}

// Wrapper stays sync so Next can prerender a static shell (which includes the
// client AppShell's usePathname()). Both params are runtime data under cache
// components, so the param-dependent work streams in behind the suspense
// fallback instead of blocking prerender.
export default function CandidateProfilePage({
  params,
  searchParams,
}: Params & SearchParams) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <CandidateProfileSkeleton />
        </PageContainer>
      }
    >
      <CandidateProfileContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CandidateProfileContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, rawSearch] = await Promise.all([params, searchParams]);
  const filters = parseCandidateSearchParams(rawSearch);
  const backHref = candidatesHref(filters);
  const filterSuffix = candidateFilterSuffix(filters);

  const data = await getCandidateWithDetails(id);
  // Unknown/stale id renders the segment's not-found.tsx (404), not an error.
  if (!data) notFound();

  const { candidate, events } = data;

  return (
    <PageContainer>
      <ProfileHeader
        backHref={backHref}
        editHref={`/candidates/${candidate.id}/edit${filterSuffix}`}
      />
      <CandidateSummary candidate={candidate} />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <StageTransitionControl
            candidateId={candidate.id}
            candidateName={candidate.name}
            currentStage={candidate.stage}
          />
          <NoteForm candidateId={candidate.id} />
        </div>
        <div className="min-w-0">
          <ActivityTimeline events={events} candidateName={candidate.name} />
        </div>
      </div>
    </PageContainer>
  );
}
