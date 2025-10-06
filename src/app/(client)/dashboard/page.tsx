'use client';

import React, { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import InterviewCard from '@/components/dashboard/interview/interviewCard';
import CreateInterviewCard from '@/components/dashboard/interview/createInterviewCard';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { InterviewService } from '@/services/interviews.service';
import { ClientService } from '@/services/clients.service';
import { ResponseService } from '@/services/responses.service';
import { useInterviews } from '@/contexts/interviews.context';
import Modal from '@/components/dashboard/Modal';
import { Gem, Plus, Rocket } from 'lucide-react';

function CardSkeleton() {
  return (
    <div className='flex flex-col h-60 w-full animate-pulse rounded-xl bg-card border border-border p-4'>
      <div className='h-6 bg-muted rounded-md w-3/4'></div>
      <div className='mt-4 h-4 bg-muted rounded-md w-1/2'></div>
      <div className='mt-auto flex items-center justify-between'>
        <div className='h-8 w-20 bg-muted rounded-md'></div>
        <div className='h-8 w-8 bg-muted rounded-full'></div>
      </div>
    </div>
  );
}

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>('');
  const [allowedResponsesCount, setAllowedResponsesCount] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!organization?.id) return;

    const fetchOrganizationData = async () => {
      try {
        const data = await ClientService.getOrganizationById(organization.id);
        if (data?.plan) {
          setCurrentPlan(data.plan);
          if (data.plan === 'free_trial_over') {
            setIsModalOpen(true);
          }
        }
        if (data?.allowed_responses_count) {
          setAllowedResponsesCount(data.allowed_responses_count);
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    if (!organization || currentPlan !== 'free') return;

    const fetchResponsesCount = async () => {
      setLoading(true);
      try {
        const totalResponses =
          await ResponseService.getResponseCountByOrganizationId(organization.id);
        if (totalResponses >= allowedResponsesCount) {
          setCurrentPlan('free_trial_over');
          await InterviewService.deactivateInterviewsByOrgId(organization.id);
          await ClientService.updateOrganization(
            { plan: 'free_trial_over' },
            organization.id
          );
        }
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsesCount();
  }, [organization, currentPlan, allowedResponsesCount]);

  return (
    <main className='p-4 sm:p-6 lg:p-6 lg:ml-60'>
      <div className='pt-10 max-w-7xl mx-auto'> 
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            Dashboard
          </h1>
          <p className='mt-1 text-muted-foreground'>
            Your interview insights await.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {currentPlan === 'free_trial_over' ? (
            <Card className='flex flex-col items-center justify-center border-dashed border-2 border-border bg-card hover:border-primary transition-all duration-300 h-60 rounded-xl'>
              <CardContent className='flex flex-col items-center justify-center text-center p-6'>
                <div className='p-3 bg-muted rounded-full mb-4'>
                  <Plus size={40} className='text-muted-foreground' />
                </div>
                <CardTitle className='text-md font-semibold'>
                  Upgrade to Create More Interviews
                </CardTitle>
              </CardContent>
            </Card>
          ) : (
            <CreateInterviewCard />
          )}

          {interviewsLoading || loading ? (
            <><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
          ) : (
            interviews.map((item) => (
              <InterviewCard
                id={item.id}
                interviewerId={item.interviewer_id}
                key={item.id}
                name={item.name}
                url={item.url ?? ''}
                readableSlug={item.readable_slug}
              />
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className='bg-card p-6 rounded-lg shadow-xl max-w-lg w-full'>
                <div className='flex flex-col items-center text-center space-y-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                        <Gem className='text-primary' size={24} />
                    </div>
                    <h3 className='text-xl font-semibold text-foreground'>
                        Unlock Full Potential
                    </h3>
                    <p className='text-muted-foreground'>
                        You have reached your limit for the free trial. Please upgrade to unlock our full potential.
                    </p>
                    <div className='w-full p-4 border rounded-lg bg-background'>
                        <div className='flex items-center gap-4'>
                            <div>
                                <Rocket className='w-12 h-12 text-primary' />
                            </div>
                            <div className='text-left'>
                                <h4 className='text-lg font-medium text-foreground'>Pro Plan</h4>
                                <ul className='list-disc pl-5 mt-1 text-sm text-muted-foreground'>
                                    <li>Flexible Pay-Per-Response</li>
                                    <li>Priority Support</li>
                                    <li>All Features</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className='text-sm text-muted-foreground pt-4'>
                        Contact{' '}
                        <a href='mailto:founders@interro.ai' className='font-semibold text-primary hover:underline'>
                            founders@interro.ai
                        </a>{' '}
                        to upgrade your plan.
                    </p>
                </div>
            </div>
        </Modal>
      )}
    </main>
  );
}

export default Interviews;
