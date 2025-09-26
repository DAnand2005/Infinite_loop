
'use client';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Interview } from '@/lib/data';
import { mockInterviews } from '@/lib/data';
import { CalendarClock, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InterviewCard } from '../page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function UpcomingInterviewsPage() {
    const [storedInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const upcomingInterviews = isClient 
        ? storedInterviews.filter(i => i.status === 'Scheduled')
        : [];
    
    return (
        <div>
            <PageHeader
                title="Upcoming Interviews"
                description="Here are all your scheduled interviews."
            />
            {upcomingInterviews.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingInterviews.map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={CalendarClock}
                    title="No Upcoming Interviews"
                    description="You haven't scheduled any interviews yet. Click below to add a new one."
                >
                    <Button asChild>
                        <Link href="/dashboard/new-interview">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Schedule New Interview
                        </Link>
                    </Button>
                </EmptyState>
            )}
        </div>
    )
}
