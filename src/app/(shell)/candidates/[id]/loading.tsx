import {
  CandidateProfileSkeleton,
  PageContainer,
} from "@/components/candidates/skeletons";

export default function CandidateProfileLoading() {
  return (
    <PageContainer>
      <CandidateProfileSkeleton />
    </PageContainer>
  );
}
