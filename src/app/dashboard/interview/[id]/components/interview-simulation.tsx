
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mic, Video, Volume2, PhoneOff, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Interview } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { mockInterviews } from '@/lib/data';
import { generateSpeechAction } from '@/lib/actions';
import Image from 'next/image';

export function InterviewSimulation({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storedInterviews, setStoredInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem(`interview_questions_${interviewId}`);
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions);
        setQuestions(parsedQuestions);
        if (parsedQuestions.length > 0) {
          fetchAudio(parsedQuestions[0]);
        }
      } else {
        setError('Interview questions could not be loaded. Please start the interview again from the dashboard.');
      }
    } catch (e) {
      setError('Failed to parse interview questions. The data may be corrupted.');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const fetchAudio = async (text: string) => {
    if (!text) return;
    setIsAudioLoading(true);
    setAudioUrl(null);
    const result = await generateSpeechAction({ text });
    if (result.success && result.data) {
      setAudioUrl(result.data.audioDataUri);
    } else {
      console.error("Failed to generate speech:", result.error);
    }
    setIsAudioLoading(false);
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [audioUrl]);

  const handleEndInterview = () => {
    const updatedInterviews = storedInterviews.map(interview => 
      interview.id === interviewId ? { ...interview, status: 'Completed' as const } : interview
    );
    setStoredInterviews(updatedInterviews);
    localStorage.removeItem(`interview_questions_${interviewId}`);
    router.push(`/dashboard/feedback/${interviewId}`);
  };
  
  const handleQuestionChange = (newIndex: number) => {
    setCurrentQuestionIndex(newIndex);
    fetchAudio(questions[newIndex]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionChange(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionChange(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading interview questions...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const progress = ((currentQuestionIndex + 1) / (questions.length || 1)) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex-grow grid lg:grid-cols-2 gap-6">
        {/* AI Avatar Side */}
        <div className="relative bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden border">
            {aiAvatar ? (
              <Image 
                src={aiAvatar.imageUrl} 
                alt="AI Interviewer" 
                fill 
                className="object-cover object-center" 
                data-ai-hint={aiAvatar.imageHint} 
              />
            ) : (
                <Avatar className="h-48 w-48">
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
            )}
             <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                <p className="text-center font-bold">AI Interviewer</p>
            </div>
        </div>

        {/* User Side */}
        <div className="flex flex-col">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
               <div className="p-4 rounded-lg bg-muted flex-1 min-h-[120px] flex items-center">
                    <p className="font-semibold text-lg">{questions[currentQuestionIndex]}</p>
                </div>
               <div className="flex items-center justify-center gap-4 h-12">
                 {isAudioLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating audio...</span>
                    </div>
                 ) : (
                    audioUrl && (
                        <audio ref={audioRef} src={audioUrl} controls className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    )
                 )}
               </div>
               <div className="relative bg-muted rounded-lg flex-grow items-center justify-center overflow-hidden border min-h-[200px]">
                 <div className="flex items-center justify-center h-full">
                    <Video className="h-24 w-24 text-muted-foreground/50"/>
                 </div>
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                    <p className="text-center font-bold">Your Camera</p>
                </div>
            </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                    <ArrowLeft className="mr-2"/> Previous
                  </Button>
                  <Button onClick={isLastQuestion ? handleEndInterview : handleNextQuestion}>
                    {isLastQuestion ? 'Finish' : 'Next'} <ArrowRight className="ml-2"/>
                  </Button>
              </div>
              <Progress value={progress} />
            </CardFooter>
          </Card>
        </div>
      </div>
       <div className="flex-shrink-0 mt-4">
        <Card>
            <CardContent className="p-4 flex justify-center items-center gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                    <Mic className="h-6 w-6"/>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                    <Video className="h-6 w-6"/>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                    <Volume2 className="h-6 w-6"/>
                </Button>
                <Button 
                  variant="destructive"
                  size="lg" 
                  className="rounded-full px-6" 
                  onClick={handleEndInterview}
                >
                    <PhoneOff className="mr-2 h-5 w-5"/> End Interview
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
