'use server';

import {
  generateInterviewFeedback,
  type GenerateInterviewFeedbackInput,
} from '@/ai/flows/generate-interview-feedback';
import {
  generatePersonalizedQuestions,
  type GeneratePersonalizedQuestionsInput,
} from '@/ai/flows/generate-personalized-questions';
import { z } from 'zod';

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
  resumeDataUri: z.string(),
  jobDescription: z.string(),
  name: z.string(),
  email: z.string().email(),
  date: z.string().optional(),
  time: z.string().optional(),
});

export async function scheduleInterviewAction(formData: FormData) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const input = scheduleInterviewInput.parse({
      resumeDataUri: formData.get('resumeDataUri'),
      jobDescription: formData.get('jobDescription'),
      name: formData.get('name'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
    });

    console.log('Interview scheduled with:', input);

    // Simulate sending an email
    console.log(`Simulating: Sending confirmation email to ${input.email}`);
    console.log(`Subject: Your Mock Interview is Scheduled!`);
    console.log(`Body: Hi ${input.name}, your interview for the position is scheduled for ${input.date ? new Date(input.date).toLocaleDateString() : 'N/A'} at ${input.time || 'N/A'}.`);

    const mockInterviewId = 'new-interview-id';
    return { success: true, data: { interviewId: mockInterviewId } };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
        return { success: false, error: 'Invalid form data provided.' };
    }
    return { success: false, error: 'Failed to schedule interview.' };
  }
}
