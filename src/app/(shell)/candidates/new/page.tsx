import { Suspense } from "react";
import type { Metadata } from "next";

import { listJobs } from "@/lib/queries";
import {
  candidateFilterSuffix,
  candidatesHref,
  parseCandidateSearchParams,
} from "@/lib/candidate-filters";
import {
  CandidateFormSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";
import { FormPageHeader } from "@/components/forms/form-page-header";
import { CandidateForm } from "@/components/candidates/candidate-form";

export const metadata: Metadata = {
  title: "New candidate",
  description: "Add a candidate to the hiring pipeline",
};

type SearchParams = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function NewCandidatePage({ searchParams }: SearchParams) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <CandidateFormSkeleton />
        </PageContainer>
      }
    >
      <NewCandidateContent searchParams={searchParams} />
    </Suspense>
  );
}

async function NewCandidateContent({ searchParams }: SearchParams) {
  const rawSearch = await searchParams;
  const filters = parseCandidateSearchParams(rawSearch);
  const openJobs = await listJobs(true);

  const filterSuffix = candidateFilterSuffix(filters);
  const backHref = candidatesHref(filters);

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-3xl">
        <FormPageHeader
          backHref={backHref}
          backLabel="Back to candidates"
          title="Add candidate"
          description="Create a candidate profile. They will enter the pipeline in Applied."
        />
        <CandidateForm
          mode="create"
          openJobs={openJobs.map((job) => ({
            id: job.id,
            title: job.title,
            status: job.status,
          }))}
          filterSuffix={filterSuffix}
          backHref={backHref}
          cancelHref={backHref}
        />
      </div>
    </PageContainer>
  );
}
