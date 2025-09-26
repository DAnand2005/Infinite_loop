'use client';

import { generateFeedbackAction } from '@/lib/actions';
import type { GenerateInterviewFeedbackOutput } from '@/ai/flows/generate-interview-feedback';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

const mockFeedbackInput = {
    resume: 'Experienced software engineer with 5 years in frontend development...',
    jobDescription: 'Seeking a senior frontend developer with expertise in React...',
    interviewTranscript: 'Q: Tell me about yourself. A: I am a passionate developer...',
};

export function FeedbackReport() {
  const [feedback, setFeedback] =
    useState<GenerateInterviewFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      setError(null);
      
      // Using mock data as inputs for the AI flow
      const result = await generateFeedbackAction(mockFeedbackInput);

      if (result.success && result.data) {
        setFeedback(result.data);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
      setIsLoading(false);
    };

    fetchFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <ThumbsUp className="h-8 w-8 text-green-500" />
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feedback?.strengths}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <ThumbsDown className="h-8 w-8 text-red-500" />
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feedback?.weaknesses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Lightbulb className="h-8 w-8 text-yellow-500" />
          <CardTitle>Suggested Improvements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feedback?.suggestedImprovements}</p>
        </CardContent>
      </Card>
    </div>
  );
}
