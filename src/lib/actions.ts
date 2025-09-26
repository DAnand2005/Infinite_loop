
'use server';

import {
  generateInterviewFeedback,
  type GenerateInterviewFeedbackInput,
} from '@/ai/flows/generate-interview-feedback';
import {
  generatePersonalizedQuestions,
  type GeneratePersonalizedQuestionsInput,
} from '@/ai/flows/generate-personalized-questions';
import { generateInterviewEmail } from '@/ai/flows/generate-interview-email';
import { generateReminderEmail } from '@/ai/flows/generate-reminder-email';
import { z } from 'zod';
import { format, subHours } from 'date-fns';
import type { Interview } from './data';

export async function generateQuestionsAction(
  input: GeneratePersonalizedQuestionsInput
) {
  try {
    const output = await generatePersonalizedQuestions(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate questions.' };
  }
}

export async function generateFeedbackAction(
  input: GenerateInterviewFeedbackInput
) {
  try {
    const output = await generateInterviewFeedback(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate feedback.' };
  }
}

const scheduleInterviewInput = z.object({
  resume: z.any(),
  jobDescription: z.string(),
  name: z.string(),
  email: z.string().email(),
  jobRole: z.string(),
  companyName: z.string(),
  date: z.string(),
  time: z.string(),
});

export async function scheduleInterviewAction(formData: FormData) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const rawInput = {
      resume: formData.get('resume'),
      jobDescription: formData.get('jobDescription'),
      name: formData.get('name'),
      email: formData.get('email'),
      jobRole: formData.get('jobRole'),
      companyName: formData.get('companyName'),
      date: formData.get('date'),
      time: formData.get('time'),
    };

    const input = scheduleInterviewInput.parse(rawInput);

    // Combine date and time for formatting
    const [hours, minutesPart] = input.time.split(':');
    const [minutes, modifier] = minutesPart.split(' ');
    let hour = parseInt(hours);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    const scheduledDate = new Date(input.date);
    scheduledDate.setHours(hour, parseInt(minutes));


    // Generate initial confirmation email
    const emailContent = await generateInterviewEmail({
      name: input.name,
      email: input.email,
      jobRole: input.jobRole,
      companyName: input.companyName,
      date: format(scheduledDate, "MMMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
    });
    
    // Generate reminder email
    const reminderContent = await generateReminderEmail({
      name: input.name,
      jobRole: input.jobRole,
      companyName: input.companyName,
      date: format(scheduledDate, "MMMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
    });

    console.log('Interview scheduled with:', input);

    // Simulate sending an email by logging to console
    console.log(`--- SIMULATING CONFIRMATION EMAIL ---`);
    console.log(`To: ${input.email}`);
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Body:\n${emailContent.body}`);
    console.log(`-----------------------------------`);
    
    const reminderDate = subHours(scheduledDate, 2);
    const mockInterviewId = `interview-${Date.now()}`;
    const newInterview: Interview = {
      id: mockInterviewId,
      role: input.jobRole,
      company: input.companyName,
      date: scheduledDate.toISOString(),
      status: 'Scheduled',
    }

    // Return content to be stored in local storage by the client
    return { 
      success: true, 
      data: {
        newInterview,
        reminder: {
          id: `reminder-${mockInterviewId}`,
          interviewId: mockInterviewId,
          sendAt: reminderDate.toISOString(),
          recipient: input.name,
          ...reminderContent
        }
      } 
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
        console.error(error.issues);
        return { success: false, error: 'Invalid form data provided.' };
    }
    return { success: false, error: 'Failed to schedule interview.' };
  }
}
