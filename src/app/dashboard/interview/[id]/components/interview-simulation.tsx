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
import { Mic, Video, Volume2, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mockQuestions = [
  "Can you tell me about yourself and your background?",
  "Walk me through a challenging project you've worked on. What was your role?",
  "Where do you see yourself in five years?",
  "What are your biggest strengths and weaknesses?",
  "Do you have any questions for me?",
];

export function InterviewSimulation({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const aiAvatar = PlaceHolderImages.find((p) => p.id === 'ai-avatar');

  const handleEndInterview = () => {
    router.push(`/dashboard/feedback/${interviewId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex-grow grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>AI Interviewer</CardTitle>
              <CardDescription>Listen carefully to the questions and provide your response.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="flex items-center gap-4">
                {aiAvatar && (
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={aiAvatar.imageUrl} data-ai-hint={aiAvatar.imageHint} alt="AI Interviewer" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                )}
                <div className="p-4 rounded-lg bg-muted flex-1">
                    <p className="font-semibold">{mockQuestions[0]}</p>
                </div>
               </div>
               <div>
                <Textarea placeholder="You can jot down your thoughts here (optional)..." rows={8}/>
               </div>
            </CardContent>
          </Card>
        </div>
        <div className="relative bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            <Video className="h-24 w-24 text-muted-foreground/50"/>
            <div className="absolute bottom-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                <p className="text-center font-bold">Your Camera</p>
                <p className="text-xs text-muted-foreground">Your video feed would appear here.</p>
            </div>
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
                <Button variant="destructive" size="lg" className="rounded-full px-6" onClick={handleEndInterview}>
                    <PhoneOff className="mr-2 h-5 w-5"/> End Interview
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
