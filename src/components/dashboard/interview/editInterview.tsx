'use client';

import { Interview, Question } from "@/types/interview";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useInterviewers } from "@/contexts/interviewers.context";
import QuestionCard from "@/components/dashboard/interview/create-popup/questionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useInterviews } from "@/contexts/interviews.context";
import { InterviewService } from "@/services/interviews.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type EditInterviewProps = {
  interview: Interview | undefined;
};

function EditInterview({ interview }: EditInterviewProps) {
  const { interviewers } = useInterviewers();
  const { fetchInterviews } = useInterviews();
  const router = useRouter();

  const [description, setDescription] = useState(interview?.description || '');
  const [objective, setObjective] = useState(interview?.objective || '');
  const [numQuestions, setNumQuestions] = useState(interview?.question_count || 1);
  const [duration, setDuration] = useState(Number(interview?.time_duration) || 5);
  const [questions, setQuestions] = useState<Question[]>(interview?.questions || []);
  const [selectedInterviewer, setSelectedInterviewer] = useState(interview?.interviewer_id);
  const [isAnonymous, setIsAnonymous] = useState(interview?.is_anonymous || false);
  const [isSaving, setIsSaving] = useState(false);

  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questions.length > (interview?.questions.length || 0)) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions.length, interview?.questions.length]);

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...newQuestion } : q)));
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < numQuestions) {
      setQuestions([...questions, { id: uuidv4(), question: "", follow_up_count: 1 }]);
    }
  };

  const onSave = async () => {
    if (!interview) return;
    setIsSaving(true);

    const interviewData = {
      objective,
      questions,
      interviewer_id: selectedInterviewer ? Number(selectedInterviewer) : undefined,
      question_count: numQuestions,
      time_duration: duration,
      description,
      is_anonymous: isAnonymous,
    };

    try {
      await InterviewService.updateInterview(interviewData, interview.id);
      await fetchInterviews();
      toast.success("Interview updated successfully.", {
        position: "bottom-right",
        duration: 3000,
      });
      router.push(`/interviews/${interview.id}`);
    } catch (error) {
      console.error("Error updating interview:", error);
      toast.error("Failed to update interview.", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteInterview = async () => {
    if (!interview) return;
    try {
      await InterviewService.deleteInterview(interview.id);
      toast.success("Interview deleted successfully.", {
        position: "bottom-right",
        duration: 3000,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="bg-background text-foreground p-4 sm:p-6 md:p-8">
        <CardHeader className="flex-row items-center justify-between p-0 mb-6">
            <Button variant='ghost' onClick={() => router.push(`/interviews/${interview?.id}`)} className='pl-0'>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Summary
            </Button>
            <div className="flex items-center gap-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='icon'><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this interview and all its associated responses.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteInterview} className='bg-destructive hover:bg-destructive/90'>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button onClick={onSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Core Details</CardTitle>
                        <CardDescription>Adjust the main details of your interview.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="objective">Objective</Label>
                            <Textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="What is the primary goal of this interview?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Interview Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the interview for your candidates." rows={4} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Questions</CardTitle>
                        <CardDescription>Add, remove, or edit the questions for this interview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] p-1 -m-1 pr-4">
                            <div className="space-y-4">
                                {questions.map((q, i) => (
                                    <QuestionCard key={q.id} questionNumber={i + 1} questionData={q} onQuestionChange={handleInputChange} onDelete={handleDeleteQuestion} isDeletable={questions.length > 1} />
                                ))}
                                <div ref={endOfListRef} />
                            </div>
                        </ScrollArea>
                        {questions.length < numQuestions && (
                            <div className='flex justify-center mt-4'>
                                <Button variant='outline' onClick={handleAddQuestion}>
                                    <Plus size={16} className='mr-2' /> Add Question
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Interviewer</CardTitle>
                        <CardDescription>Select the AI personality for the interview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="w-full whitespace-nowrap rounded-md">
                            <div className="flex w-max space-x-4 pb-4">
                            {interviewers.map((item) => (
                                <div key={item.id} onClick={() => setSelectedInterviewer(item.id)} className='shrink-0 text-center'>
                                    <div className='w-24 h-24 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all duration-300 data-[selected=true]:ring-primary' data-selected={selectedInterviewer === item.id}>
                                        <Image src={item.image} alt={item.name} width={96} height={96} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="mt-2 text-sm font-medium">{item.name}</p>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label htmlFor="anonymous-switch">Anonymous Responses</Label>
                                <p className="text-xs text-muted-foreground">Hide candidate names and emails.</p>
                            </div>
                            <Switch id="anonymous-switch" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="num-questions">Number of Questions</Label>
                            <Input id="num-questions" type="number" min={questions.length} max="5" value={numQuestions} onChange={(e) => setNumQuestions(Math.min(5, Number(e.target.value)))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Max Duration (mins)</Label>
                            <Input id="duration" type="number" min="1" max="10" value={duration} onChange={(e) => setDuration(Math.min(10, Number(e.target.value)))} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

export default EditInterview;
