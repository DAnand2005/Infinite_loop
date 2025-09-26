
'use client';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Interview } from '@/lib/data';
import { mockInterviews } from '@/lib/data';
import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InterviewCard } from '../page';


export default function FeedbackHistoryPage() {
    const [storedInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const pastInterviews = isClient 
        ? storedInterviews.filter(i => i.status === 'Completed' || i.status === 'Not Attended')
        : [];
    
    return (
        <div>
            <PageHeader
                title="Meeting History"
                description="Review your performance from all past interviews."
            />
            {pastInterviews.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastInterviews.map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={ClipboardList}
                    title="No Meetings Yet"
                    description="Your meeting reports will appear here after you complete an interview."
                />
            )}
        </div>
    )
}
