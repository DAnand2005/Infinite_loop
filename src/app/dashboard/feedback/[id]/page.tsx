import { PageHeader } from "@/components/page-header";
import { FeedbackReport } from "./components/feedback-report";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingSummary } from "./components/meeting-summary";

function FeedbackSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}

function MeetingSummarySkeleton() {
    return (
        <div className="mb-8">
            <Skeleton className="h-36 w-full" />
        </div>
    );
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <PageHeader
        title="Interview Feedback Report"
        description="Here is the detailed analysis of your interview performance."
      />
      <Suspense fallback={<MeetingSummarySkeleton />}>
        <MeetingSummary interviewId={params.id} />
      </Suspense>
      <Suspense fallback={<FeedbackSkeleton />}>
        <FeedbackReport />
      </Suspense>
    </div>
  );
}
