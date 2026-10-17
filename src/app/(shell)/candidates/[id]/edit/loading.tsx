import {
  CandidateFormSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";

export default function EditCandidateLoading() {
  return (
    <PageContainer>
      <CandidateFormSkeleton />
    </PageContainer>
  );
}
