'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useInterviewers } from '@/contexts/interviewers.context';
import { InterviewBase, Question } from '@/types/interview';
import { Info, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import FileUpload from '../fileUpload';
import Modal from '@/components/dashboard/Modal';
import InterviewerDetailsModal from '@/components/dashboard/interviewer/interviewerDetailsModal';
import { Interviewer } from '@/types/interviewer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  setLoading: (loading: boolean) => void;
  interviewData: InterviewBase;
  setInterviewData: (interviewData: InterviewBase) => void;
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

function DetailsPopup({
  open,
  setLoading,
  interviewData,
  setInterviewData,
  isUploaded,
  setIsUploaded,
  fileName,
  setFileName,
}: Props) {
  const { interviewers } = useInterviewers();
  const [isClicked, setIsClicked] = useState(false);
  const [openInterviewerDetails, setOpenInterviewerDetails] = useState(false);
  const [interviewerDetails, setInterviewerDetails] = useState<Interviewer>();

  const [name, setName] = useState(interviewData.name);
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interviewData.interviewer_id,
  );
  const [objective, setObjective] = useState(interviewData.objective);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(
    interviewData.is_anonymous,
  );
  const [numQuestions, setNumQuestions] = useState(
    interviewData.question_count == 0
      ? ''
      : String(interviewData.question_count),
  );
  const [duration, setDuration] = useState(interviewData.time_duration);
  const [uploadedDocumentContext, setUploadedDocumentContext] = useState('');

  const onGenerateQuestions = async () => {
    setLoading(true);
    try {
      const data = {
        name: name.trim(),
        objective: objective.trim(),
        number: numQuestions,
        context: uploadedDocumentContext,
      };

      const generatedQuestions = await axios.post("/api/generate-interview-questions", data);
      let generatedQuestionsResponse;

      try {
        generatedQuestionsResponse = JSON.parse(generatedQuestions?.data?.response);
      } catch (error) {
        toast.error('Error parsing AI response. Please try again.');
        console.error('Error parsing AI response:', error);
        return; // Stop execution if parsing fails
      }

      const updatedQuestions = generatedQuestionsResponse.questions.map((question: Question) => ({
        id: uuidv4(),
        question: question.question.trim(),
        follow_up_count: 1,
      }));

      const updatedInterviewData = {
        ...interviewData,
        name: name.trim(),
        objective: objective.trim(),
        questions: updatedQuestions,
        interviewer_id: selectedInterviewer,
        question_count: Number(numQuestions),
        time_duration: String(duration),
        description: generatedQuestionsResponse.description,
        is_anonymous: isAnonymous,
      };
      setInterviewData(updatedInterviewData);
    } catch (error) {
      toast.error('Error generating questions. Please try again.');
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onManual = () => {
    setLoading(true);
    const updatedInterviewData = {
      ...interviewData,
      name: name.trim(),
      objective: objective.trim(),
      questions: [{ id: uuidv4(), question: '', follow_up_count: 1 }],
      interviewer_id: selectedInterviewer,
      question_count: Number(numQuestions),
      time_duration: String(duration),
      description: '',
      is_anonymous: isAnonymous,
    };
    setInterviewData(updatedInterviewData);
  };

  useEffect(() => {
    if (!open) {
      setName('');
      setSelectedInterviewer(BigInt(0));
      setObjective('');
      setIsAnonymous(false);
      setNumQuestions('');
      setDuration('');
      setIsClicked(false);
    }
  }, [open]);

  return (
    <div className='bg-card text-foreground p-6 rounded-lg shadow-xl w-[42rem]'>
      <h1 className='text-2xl font-semibold text-center mb-6'>Create an Interview</h1>
      
      <div className='space-y-4'>
        <div>
          <Label htmlFor='interviewName'>Interview Name</Label>
          <Input
            id='interviewName'
            type='text'
            placeholder='e.g. Senior Frontend Developer Role'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => setName(e.target.value.trim())}
          />
        </div>

        <div>
          <Label>Select an Interviewer</Label>
          <div className='flex items-center gap-4 mt-2'>
            {interviewers.map((item) => (
              <div key={item.id} className='relative'>
                <div 
                  className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${selectedInterviewer === item.id ? 'border-4 border-primary' : 'border-2 border-border'}`}
                  onClick={() => setSelectedInterviewer(item.id)}
                >
                  <Image
                    src={item.image}
                    alt={`Picture of ${item.name}`}
                    width={96}
                    height={96}
                    className='w-full h-full object-cover'
                  />
                </div>
                <p className='text-center mt-2 text-sm font-medium'>{item.name}</p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='absolute top-0 right-0 h-6 w-6'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInterviewerDetails(item);
                                    setOpenInterviewerDetails(true);
                                }}
                                >
                                <Info size={16} className='text-muted-foreground' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View Details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor='objective'>Objective</Label>
          <Textarea
            id='objective'
            value={objective}
            placeholder='e.g. Find the best candidates based on their technical skills...'
            onChange={(e) => setObjective(e.target.value)}
            onBlur={(e) => setObjective(e.target.value.trim())}
            className='h-28'
          />
        </div>

        <div>
            <Label>Upload Documents (Optional)</Label>
            <FileUpload
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                fileName={fileName}
                setFileName={setFileName}
                setUploadedDocumentContext={setUploadedDocumentContext}
            />
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <Label htmlFor='anonymousSwitch' className='flex items-center gap-4 cursor-pointer'>
              <span>Make responses anonymous?</span>
              <Switch
                id='anonymousSwitch'
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </Label>
            <p className='text-xs text-muted-foreground mt-1'>If not anonymous, the interviewee\'s email and name will be collected.</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='numQuestions'>Number of Questions</Label>
            <Input
              id='numQuestions'
              type='number'
              step='1'
              max='5'
              min='1'
              value={numQuestions}
              onChange={(e) => {
                let value = e.target.value;
                if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
                    if (Number(value) > 5) value = '5';
                    setNumQuestions(value);
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor='duration'>Duration (mins)</Label>
            <Input
              id='duration'
              type='number'
              step='1'
              max='10'
              min='1'
              value={duration}
              onChange={(e) => {
                let value = e.target.value;
                if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
                    if (Number(value) > 10) value = '10';
                    setDuration(value);
                }
              }}
            />
          </div>
        </div>

        <div className='flex justify-end gap-4 pt-4'>
          <Button
            variant='outline'
            disabled={!name || !objective || !numQuestions || !duration || selectedInterviewer == BigInt(0) || isClicked}
            onClick={() => {
              setIsClicked(true);
              onManual();
            }}
          >
            I'll Write Questions Myself
          </Button>
          <Button
            disabled={!name || !objective || !numQuestions || !duration || selectedInterviewer == BigInt(0) || isClicked}
            onClick={() => {
              setIsClicked(true);
              onGenerateQuestions();
            }}
          >
            Generate Questions with AI
          </Button>
        </div>
      </div>

      <Modal
        open={openInterviewerDetails}
        closeOnOutsideClick={true}
        onClose={() => setOpenInterviewerDetails(false)}
      >
        <InterviewerDetailsModal interviewer={interviewerDetails} />
      </Modal>
    </div>
  );
}

export default DetailsPopup;
