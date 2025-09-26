
'use client';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Interview } from '@/lib/data';
import { mockInterviews } from '@/lib/data';
import { CalendarClock, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InterviewCard } from '../page';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MeetingRoomPage() {
    const [storedInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);
    const [isClient, setIsClient] = useState(false);
    const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const upcomingInterviews = isClient 
        ? storedInterviews.filter(i => i.status === 'Scheduled')
        : [];
    
    return (
        <div>
            <PageHeader
                title="Meeting Room"
                description="Find and start your upcoming interviews here."
            />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            {aiAvatar && (
                                <Image 
                                    src={aiAvatar.imageUrl}
                                    alt="AI Interviewer"
                                    width={128}
                                    height={128}
                                    className="rounded-full mb-4"
                                    data-ai-hint={aiAvatar.imageHint}
                                />
                            )}
                            <h3 className="text-xl font-semibold font-headline">AI Interviewer</h3>
                            <p className="text-muted-foreground mt-2">
                                Welcome to the meeting room. When you're ready, select an upcoming interview and click "Start Meeting" to begin.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    {upcomingInterviews.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-6">
                            {upcomingInterviews.map((interview) => (
                                <InterviewCard key={interview.id} interview={interview} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={CalendarClock}
                            title="No Upcoming Interviews"
                            description="You have no interviews scheduled. Please schedule one to get started."
                        >
                            <Button asChild>
                                <Link href="/dashboard/new-interview">
                                    Schedule an Interview
                                </Link>
                            </Button>
                        </EmptyState>
                    )}
                </div>
            </div>
        </div>
    )
}
