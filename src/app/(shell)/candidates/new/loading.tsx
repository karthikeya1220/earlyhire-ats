import {
  CandidateFormSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";

export default function NewCandidateLoading() {
  return (
    <PageContainer>
      <CandidateFormSkeleton />
    </PageContainer>
  );
}
