'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy, ArrowUpRight, CopyCheck, User, MessageSquare } from 'lucide-react';
import { ResponseService } from '@/services/responses.service';
import axios from 'axios';
import MiniLoader from '@/components/loaders/mini-loader/miniLoader';
import { InterviewerService } from '@/services/interviewers.service';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  name: string | null;
  interviewerId: bigint;
  id: string;
  url: string;
  readableSlug: string;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [interviewer, setInterviewer] = useState<{ image: string; name: string } | null>(null);

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const fetchedInterviewer = await InterviewerService.getInterviewer(interviewerId);
        setInterviewer(fetchedInterviewer);
      } catch (error) {
        console.error('Error fetching interviewer:', error);
      }
    };
    fetchInterviewer();
  }, [interviewerId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responses = await ResponseService.getAllResponses(id);
        setResponseCount(responses.length);
        if (responses.some(r => !r.is_analysed)) {
          setIsFetching(true);
          await Promise.all(responses.map(response => {
            if (!response.is_analysed) {
              return axios.post('/api/get-call', { id: response.call_id }).catch(error => 
                console.error(`Failed to call api/get-call for response id ${response.call_id}:`, error)
              );
            }
            return Promise.resolve();
          }));
          setIsFetching(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponses();
  }, [id]);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const interviewUrl = readableSlug ? `${base_url}/call/${readableSlug}` : (url as string);
    navigator.clipboard.writeText(interviewUrl).then(() => {
      setCopied(true);
      toast.success('Interview link copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    }, (err) => {
      toast.error('Failed to copy link.');
      console.error('Failed to copy', err.message);
    });
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const interviewUrl = readableSlug ? `/call/${readableSlug}` : `/call/${url}`;
    window.open(interviewUrl, '_blank');
  };

  const cardContent = (
    <Card className={`relative flex flex-col h-full bg-card rounded-xl shadow-md transition-all duration-300 hover:border-primary ${isFetching ? 'opacity-70' : ''}`}>
      <CardHeader className='flex-row items-start justify-between'>
        <div className="min-w-0">
          <CardTitle className='text-lg font-semibold text-foreground truncate'>
            {name}
          </CardTitle>
          {interviewer && (
             <CardDescription className='flex items-center gap-2 mt-2'>
                <Avatar className='h-6 w-6'>
                    <AvatarImage src={interviewer.image} alt={interviewer.name} />
                    <AvatarFallback><User className='h-4 w-4'/></AvatarFallback>
                </Avatar>
                <span className='text-xs'>{interviewer.name}</span>
            </CardDescription>
          )}
        </div>
        {isFetching && <MiniLoader />}
      </CardHeader>

      <CardFooter className='flex items-center justify-between mt-auto pt-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MessageSquare className='h-4 w-4'/>
            <span>{responseCount?.toString() || 0} Responses</span>
        </div>

        <div className='flex items-center gap-1'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleJumpToInterview}>
                  <ArrowUpRight className='h-4 w-4'/>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Open Interview</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  {copied ? <CopyCheck className='h-4 w-4 text-primary'/> : <Copy className='h-4 w-4'/>}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Copy Link</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );

  return isFetching ? (
    <div className='relative'>{cardContent}</div>
  ) : (
    <a href={`/interviews/${id}`} className='block h-full'>
      {cardContent}
    </a>
  );
}

export default InterviewCard;
