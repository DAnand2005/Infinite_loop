import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockInterviews, type Interview } from '@/lib/data';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock, PlusCircle } from 'lucide-react';
import Link from 'next/link';

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{interview.role}</CardTitle>
        <CardDescription>{interview.company}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(interview.date), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(interview.date), 'h:mm a')}</span>
        </div>
      </CardContent>
      <CardFooter>
        {interview.status === 'Scheduled' ? (
          <Button asChild className="w-full">
            <Link href={`/dashboard/interview/${interview.id}`}>Start Interview</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/dashboard/feedback/${interview.id}`}>
              View Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const scheduledInterviews = mockInterviews.filter(
    (i) => i.status === 'Scheduled'
  );
  const completedInterviews = mockInterviews.filter(
    (i) => i.status === 'Completed'
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your interview preparations."
      >
        <Button asChild>
          <Link href="/dashboard/new-interview">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Mock Interview
          </Link>
        </Button>
      </PageHeader>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Upcoming Interviews</h2>
          {scheduledInterviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have no upcoming interviews scheduled.</p>
          )}
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Past Interviews</h2>
          {completedInterviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You haven't completed any interviews yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
