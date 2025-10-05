'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useClerk, useOrganization } from '@clerk/nextjs';
import { InterviewBase, Question } from '@/types/interview';
import { useInterviews } from '@/contexts/interviews.context';
import { ScrollArea } from '@/components/ui/scroll-area';
import QuestionCard from '@/components/dashboard/interview/create-popup/questionCard';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  interviewData: InterviewBase;
  setProceed: (proceed: boolean) => void;
  setOpen: (open: boolean) => void;
}

function QuestionsPopup({ interviewData, setProceed, setOpen }: Props) {
  const { user } = useClerk();
  const { organization } = useOrganization();
  const [isClicked, setIsClicked] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(
    interviewData.questions,
  );
  const [description, setDescription] = useState<string>(
    interviewData.description.trim(),
  );
  const { fetchInterviews } = useInterviews();

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(questions.length);

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, ...newQuestion } : question,
      ),
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((question) => question.id !== id));
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < interviewData.question_count) {
      setQuestions([
        ...questions,
        { id: uuidv4(), question: '', follow_up_count: 1 },
      ]);
    }
  };

  const onSave = async () => {
    try {
      setIsClicked(true);
      const payload = {
        ...interviewData,
        user_id: user?.id || '',
        organization_id: organization?.id || '',
        questions,
        description,
        interviewer_id: interviewData.interviewer_id.toString(),
        response_count: interviewData.response_count.toString(),
        logo_url: organization?.imageUrl || '',
      };

      await axios.post('/api/create-interview', {
        organizationName: organization?.name,
        interviewData: payload,
      });

      fetchInterviews();
      setOpen(false);
    } catch (error) {
      console.error('Error creating interview:', error);
      setIsClicked(false); // Re-enable button on error
    }
  };

  useEffect(() => {
    if (questions.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevQuestionLengthRef.current = questions.length;
  }, [questions.length]);

  const allQuestionsFilled = questions.every((q) => q.question.trim() !== '');

  return (
    <div className='bg-card text-foreground p-6 rounded-lg shadow-xl w-[42rem]'>
      <div className='flex items-center justify-between mb-6'>
        <Button variant='ghost' size='icon' onClick={() => setProceed(false)}>
          <ChevronLeft size={24} />
        </Button>
        <h1 className='text-2xl font-semibold'>Review Questions</h1>
        <div className='w-10'></div> {/* Spacer */}
      </div>

      <p className='text-muted-foreground text-sm mb-4'>
        We will use these questions during the interviews. Please make sure they are correct.
      </p>

      <ScrollArea className='h-64 pr-4 -mr-4 mb-4'>
        <div className='space-y-4'>
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              questionNumber={index + 1}
              questionData={question}
              onDelete={handleDeleteQuestion}
              onQuestionChange={handleInputChange}
              isDeletable={questions.length > 1}
            />
          ))}
          <div ref={endOfListRef} />
        </div>
      </ScrollArea>

      {questions.length < interviewData.question_count && (
        <div className='flex justify-center my-4'>
          <Button variant='outline' onClick={handleAddQuestion}>
            <Plus size={16} className='mr-2' />
            Add Another Question
          </Button>
        </div>
      )}

      <div className='space-y-2 mb-6'>
        <Label htmlFor='description'>Interview Description</Label>
        <Textarea
            id='description'
            value={description}
            placeholder='Provide a brief description of the interview. This will be visible to candidates.'
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => setDescription(e.target.value.trim())}
        />
        <p className='text-xs text-muted-foreground'>Note: This description will be visible to interviewees.</p>
      </div>

      <div className='flex justify-end'>
        <Button
          disabled={isClicked || !allQuestionsFilled || description.trim() === ''}
          onClick={onSave}
        >
          Save Interview
        </Button>
      </div>
    </div>
  );
}

export default QuestionsPopup;
