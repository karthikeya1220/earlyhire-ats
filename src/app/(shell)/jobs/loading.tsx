import { PageContainer } from "@/components/candidates/skeletons";
import { JobsSkeleton } from "@/components/jobs/jobs-skeleton";

export default function JobsLoading() {
  return (
    <PageContainer>
      <JobsSkeleton />
    </PageContainer>
  );
}
