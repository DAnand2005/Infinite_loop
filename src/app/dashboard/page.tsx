
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockInterviews, type Interview } from '@/lib/data';
import { format, formatDistanceToNow, isBefore, subMinutes } from 'date-fns';
import { ArrowRight, Calendar, Clock, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect, useState } from 'react';
import { generateQuestionsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/empty-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function InterviewCard({ interview }: { interview: Interview }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartInterview = async () => {
    setIsLoading(true);
    // This is a mock resume text. In a real app, you'd fetch this.
    const mockResumeText = "Experienced software engineer with a background in React and Node.js. Looking for a challenging role in a fast-paced environment.";
    
    const result = await generateQuestionsAction({ resumeText: mockResumeText });

    if (result.success && result.data) {
      // Store questions in local storage to be retrieved on the interview page
      localStorage.setItem(`interview_questions_${interview.id}`, JSON.stringify(result.data.questions));
      router.push(`/dashboard/interview/${interview.id}`);
    } else {
      toast({
        title: 'Error',
        description: 'Could not generate interview questions. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const isNotAttended = interview.status === 'Not Attended';
  const interviewDateTime = new Date(interview.date);
  const tenMinutesBefore = subMinutes(interviewDateTime, 10);
  const canStart = isClient && isBefore(new Date(), interviewDateTime) && isBefore(tenMinutesBefore, new Date());
  const isButtonDisabled = isLoading || !canStart;

  const renderCardFooter = () => {
    switch(interview.status) {
      case 'Scheduled':
        const StartButton = (
          <Button onClick={handleStartInterview} className="w-full" disabled={isButtonDisabled}>
            {isLoading ? 'Preparing...' : 'Start Interview'}
          </Button>
        );

        if (isButtonDisabled && !isLoading) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} className="w-full">
                                {StartButton}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>You can start this interview 10 minutes before the scheduled time.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
        return StartButton;
      case 'Completed':
        return (
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/dashboard/feedback/${interview.id}`}>
              View Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        );
      case 'Not Attended':
        return (
           <div className='w-full flex items-center justify-center'>
             <Badge variant="destructive">Not Attended</Badge>
           </div>
        )
      default:
        return null;
    }
  }

  return (
    <Card className={cn(isNotAttended && 'bg-muted/50 border-dashed')}>
      <CardHeader>
        <CardTitle className={cn(isNotAttended && 'text-muted-foreground')}>{interview.role}</CardTitle>
        <CardDescription>{interview.company}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(interviewDateTime, 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{format(interviewDateTime, 'h:mm a')}</span>
        </div>
        {interview.status === 'Scheduled' && (
           <div className="flex items-center gap-2 pt-1">
             <span className="text-xs text-primary font-semibold">Starts {formatDistanceToNow(interviewDateTime, { addSuffix: true })}</span>
           </div>
        )}
      </CardContent>
      <CardFooter>
        {renderCardFooter()}
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const [storedInterviews, setStoredInterviews] = useLocalStorage<Interview[]>(
    'interviews',
    mockInterviews
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const now = new Date();
    const checkAndUpdateInterviews = () => {
        const updatedInterviews = storedInterviews.map(interview => {
          const interviewDate = new Date(interview.date);
          if (interview.status === 'Scheduled' && isBefore(interviewDate, now)) {
            return { ...interview, status: 'Not Attended' as const };
          }
          return interview;
        });

        if (JSON.stringify(updatedInterviews) !== JSON.stringify(storedInterviews)) {
            setStoredInterviews(updatedInterviews);
        }
    };

    checkAndUpdateInterviews();
    const intervalId = setInterval(checkAndUpdateInterviews, 60000); // Check every minute

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const interviews = isClient ? storedInterviews : [];

  const scheduledInterviews = interviews.filter(
    (i) => i.status === 'Scheduled'
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
          <h2 className="text-2xl font-semibold font-headline mb-4">
            Upcoming Interviews
          </h2>
          {scheduledInterviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Interviews"
              description="You have no interviews scheduled. Click below to set one up."
            >
              <Button asChild>
                <Link href="/dashboard/new-interview">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Link>
              </Button>
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
}
