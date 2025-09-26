
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mic, Video, Volume2, PhoneOff, Loader2, MicOff, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Interview } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { mockInterviews } from '@/lib/data';
import { generateSpeechAction, continueConversationAction } from '@/lib/actions';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type InterviewStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'finished';

// Hook for Speech Recognition
const useSpeechRecognition = (onResult: (transcript: string) => void) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      setIsSupported(false);
    }
  }, [onResult]);

  const startListening = useCallback(() => {
    recognitionRef.current?.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { startListening, stopListening, isSupported };
};

export function InterviewSimulation({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');
  const [storedInterviews, setStoredInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);
  const [interviewDetails, setInterviewDetails] = useState<Interview | null>(null);
  
  const [status, setStatus] = useState<InterviewStatus>('idle');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get current interview details
  useEffect(() => {
    const foundInterview = storedInterviews.find(i => i.id === interviewId);
    if (foundInterview) {
        setInterviewDetails(foundInterview);
    } else {
        setError("Could not find interview details.");
    }
  }, [interviewId, storedInterviews]);
  
  const handleUserAnswer = useCallback(async (answer: string) => {
      setStatus('processing');
      setConversation(prev => [...prev, { role: 'user', content: answer }]);
      
      if (!interviewDetails) {
          setError("Interview details are missing.");
          setStatus('idle');
          return;
      }

      const result = await continueConversationAction({
          jobRole: interviewDetails.role,
          companyName: interviewDetails.company,
          history: conversation,
          userAnswer: answer,
      });

      if (result.success && result.data) {
          const { interviewerResponse, endInterview } = result.data;
          setConversation(prev => [...prev, { role: 'model', content: interviewerResponse }]);
          await fetchAudio(interviewerResponse); // This will set status to 'speaking'
          if(endInterview) {
            setTimeout(() => setStatus('finished'), 3000); // Give time for last message
          }
      } else {
          setError(result.error || "There was an issue with the AI's response.");
          setStatus('idle');
      }
  }, [conversation, interviewDetails]);

  const { startListening, stopListening, isSupported } = useSpeechRecognition(handleUserAnswer);

  const fetchAudio = async (text: string) => {
    if (!text) return;
    setAudioUrl(null);
    const result = await generateSpeechAction({ text });
    if (result.success && result.data) {
      setAudioUrl(result.data.audioDataUri);
    } else {
      console.error("Failed to generate speech:", result.error);
      // Fallback to idle state if audio fails
      setStatus('idle');
    }
  };
  
  // Effect to handle audio playback and status changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
        setStatus('speaking');
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
            setStatus('idle');
        });

        const handleAudioEnd = () => {
            if (status !== 'finished') {
                setStatus('idle');
            }
        };
        audioRef.current.addEventListener('ended', handleAudioEnd);
        return () => audioRef.current?.removeEventListener('ended', handleAudioEnd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const handleStartInterview = async () => {
    const greeting = "Hello, thank you for coming in today. To start, could you tell me a little bit about yourself and your background?";
    setConversation([{ role: 'model', content: greeting }]);
    await fetchAudio(greeting);
  };
  
  const handleEndInterview = () => {
    stopListening();
    const updatedInterviews = storedInterviews.map(interview => 
      interview.id === interviewId ? { ...interview, status: 'Completed' as const } : interview
    );
    setStoredInterviews(updatedInterviews);
    router.push(`/dashboard/feedback/${interviewId}`);
  };

  const handleMicClick = () => {
    if (status === 'listening') {
      stopListening();
      setStatus('processing');
    } else {
      setStatus('listening');
      startListening();
    }
  };

  if (!isSupported) {
    return (
        <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Browser Not Supported</AlertTitle>
            <AlertDescription>
                Your browser does not support the Web Speech API required for this feature. 
                Please use the latest version of Google Chrome or another supported browser.
            </AlertDescription>
        </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const isInterviewStarted = conversation.length > 0;
  
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
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-4 right-4">
                {status === 'speaking' && <Badge variant="secondary"><Volume2 className="mr-2 animate-pulse text-green-400" />Speaking...</Badge>}
                {status === 'processing' && <Badge variant="secondary"><Loader2 className="mr-2 animate-spin" />Thinking...</Badge>}
            </div>
             <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                <p className="text-center font-bold">AI Interviewer</p>
            </div>
        </div>

        {/* User & Transcript Side */}
        <div className="flex flex-col">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>
                {interviewDetails?.role} Interview at {interviewDetails?.company}
              </CardTitle>
              <CardDescription>
                This is a conversational interview. Click the microphone to speak.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
               <ScrollArea className="flex-grow p-4 rounded-lg bg-muted border min-h-[300px]">
                    <div className="space-y-4">
                        {conversation.map((msg, index) => (
                            <div key={index} className={cn("flex gap-2", msg.role === 'user' && 'justify-end')}>
                                {msg.role === 'model' && <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>}
                                <div className={cn("p-3 rounded-lg max-w-sm", msg.role === 'model' ? 'bg-background' : 'bg-primary text-primary-foreground')}>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
               </ScrollArea>
               <div className="relative bg-muted rounded-lg flex-grow items-center justify-center overflow-hidden border min-h-[150px]">
                 <div className="flex items-center justify-center h-full">
                    <Video className="h-24 w-24 text-muted-foreground/50"/>
                 </div>
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                    <p className="text-center font-bold">Your Camera</p>
                </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <div className="flex-shrink-0 mt-4">
        <Card>
            <CardContent className="p-4 flex justify-center items-center gap-4">
                {!isInterviewStarted ? (
                    <Button size="lg" className="rounded-full px-6" onClick={handleStartInterview}>
                        Start Interview
                    </Button>
                ) : (
                    <>
                        <Button 
                            variant={status === 'listening' ? 'destructive' : 'outline'} 
                            size="icon" 
                            className="h-16 w-16 rounded-full"
                            onClick={handleMicClick}
                            disabled={status === 'speaking' || status === 'processing' || status === 'finished'}
                        >
                            {status === 'listening' ? <MicOff className="h-8 w-8"/> : <Mic className="h-8 w-8"/>}
                        </Button>
                        <Button 
                          variant="destructive"
                          size="lg" 
                          className="rounded-full px-6" 
                          onClick={handleEndInterview}
                        >
                            <PhoneOff className="mr-2 h-5 w-5"/> End Interview
                        </Button>
                    </>
                )}
                 {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
