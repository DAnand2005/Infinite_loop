'use client';

import { Question } from "@/types/interview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface QuestionCardProps {
  questionNumber: number;
  questionData: Question;
  onQuestionChange: (id: string, question: Question) => void;
  onDelete: (id: string) => void;
  isDeletable: boolean;
}

function QuestionCard({ questionNumber, questionData, onQuestionChange, onDelete, isDeletable }: QuestionCardProps) {
  const depthValue = questionData.follow_up_count.toString();

  return (
    <Card className='bg-background border border-border shadow-none'>
      <CardHeader className='flex-row items-center justify-between p-4'>
        <CardTitle className='text-md font-semibold'>Question {questionNumber}</CardTitle>
        <div className='flex items-center gap-2'>
          <Label className='text-sm'>Depth:</Label>
          <ToggleGroup
            type='single'
            size='sm'
            value={depthValue}
            onValueChange={(value) => {
              if (value) {
                onQuestionChange(questionData.id, {
                  ...questionData,
                  follow_up_count: Number(value),
                });
              }
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <ToggleGroupItem value="1" aria-label='Low depth'>Low</ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent><p>Brief follow-up</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="2" aria-label='Medium depth'>Mid</ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent><p>Moderate follow-up</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="3" aria-label='High depth'>High</ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent><p>In-depth follow-up</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        <div className='flex items-start gap-2'>
          <Textarea
            value={questionData.question}
            placeholder={`e.g. Can you tell me about a challenging project you\'ve worked on?`}
            rows={3}
            onChange={(e) =>
              onQuestionChange(questionData.id, {
                ...questionData,
                question: e.target.value,
              })
            }
            onBlur={(e) =>
              onQuestionChange(questionData.id, {
                ...questionData,
                question: e.target.value.trim(),
              })
            }
            className='resize-none'
          />
          {isDeletable && (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon' onClick={() => onDelete(questionData.id)} className='mt-1'>
                            <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Delete Question</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestionCard;
