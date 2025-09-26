
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Interview } from "@/lib/data";
import { mockInterviews } from "@/lib/data";
import { Calendar, Building, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export function MeetingSummary({ interviewId }: { interviewId: string }) {
    const [storedInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const foundInterview = storedInterviews.find(i => i.id === interviewId);
        if (foundInterview) {
            setInterview(foundInterview);
        }
    }, [interviewId, storedInterviews]);

    if (!isClient) {
        return (
            <Card className="mb-8">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (!interview) {
        return null;
    }

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Meeting Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-muted-foreground">Job Role</p>
                            <p className="font-semibold">{interview.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-semibold">{interview.company}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-semibold">{format(new Date(interview.date), 'MMMM d, yyyy - h:mm a')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
