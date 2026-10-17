import { CandidateListSkeleton } from "@/components/candidates/skeletons";

export default function CandidatesLoading() {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mb-4">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="mt-2 h-3 w-32 rounded bg-muted/70" />
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-9 w-full rounded-md bg-muted/60 sm:max-w-xs" />
        <div className="flex flex-1 gap-2">
          <div className="h-9 w-28 rounded-md bg-muted/60" />
          <div className="h-9 w-32 rounded-md bg-muted/60" />
        </div>
      </div>
      <CandidateListSkeleton />
    </div>
  );
}
