import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCandidateWithDetails, listJobs } from "@/lib/queries";
import {
  candidateFilterSuffix,
  parseCandidateSearchParams,
} from "@/lib/candidate-filters";
import {
  CandidateFormSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";
import { FormPageHeader } from "@/components/forms/form-page-header";
import {
  CandidateForm,
  type CandidateFormValues,
  type JobOption,
} from "@/components/candidates/candidate-form";

type Params = { params: Promise<{ id: string }> };
type SearchParams = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getCandidateWithDetails(id);
    if (!data) return { title: "Candidate not found" };
    return { title: `Edit ${data.candidate.name}` };
  } catch {
    return { title: "Edit candidate" };
  }
}

export default function EditCandidatePage({
  params,
  searchParams,
}: Params & SearchParams) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <CandidateFormSkeleton />
        </PageContainer>
      }
    >
      <EditCandidateContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function EditCandidateContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, rawSearch] = await Promise.all([params, searchParams]);
  const filters = parseCandidateSearchParams(rawSearch);
  const filterSuffix = candidateFilterSuffix(filters);

  const [data, openJobs] = await Promise.all([
    getCandidateWithDetails(id),
    listJobs(true),
  ]);
  if (!data) notFound();

  const { candidate } = data;
  const backHref = `/candidates/${candidate.id}${filterSuffix}`;

  const closedCurrentJob: JobOption | null =
    candidate.job_id && candidate.job_status === "closed"
      ? {
          id: candidate.job_id,
          title: candidate.job_title ?? "Current role",
          status: "closed",
        }
      : null;

  const initial: CandidateFormValues = {
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone ?? "",
    location: candidate.location ?? "",
    current_title: candidate.current_title ?? "",
    current_company: candidate.current_company ?? "",
    experience_years: candidate.experience_years?.toString() ?? "",
    skills: candidate.skills.join(", "),
    resume_summary: candidate.resume_summary ?? "",
    source: candidate.source,
    job_id: candidate.job_id ?? "",
  };

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-3xl">
        <FormPageHeader
          backHref={backHref}
          backLabel="Back to candidate"
          title={`Edit ${candidate.name}`}
          description="Update candidate details. Stage changes stay on the profile so activity history remains consistent."
        />
        <CandidateForm
          mode="edit"
          candidateId={candidate.id}
          initial={initial}
          currentStage={candidate.stage}
          openJobs={openJobs.map((job) => ({
            id: job.id,
            title: job.title,
            status: job.status,
          }))}
          closedCurrentJob={closedCurrentJob}
          filterSuffix={filterSuffix}
          backHref={backHref}
          cancelHref={backHref}
        />
      </div>
    </PageContainer>
  );
}
