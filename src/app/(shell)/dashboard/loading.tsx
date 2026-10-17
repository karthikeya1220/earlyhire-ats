import { PageContainer } from "@/components/candidates/skeletons";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <PageContainer>
      <DashboardSkeleton />
    </PageContainer>
  );
}
