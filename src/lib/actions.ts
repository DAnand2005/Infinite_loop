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
});

export async function scheduleInterviewAction(formData: FormData) {
  try {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you would save the interview details to a database.
    // For now, we'll just log the data.
    const input = scheduleInterviewInput.parse({
      resumeDataUri: formData.get('resumeDataUri'),
      jobDescription: formData.get('jobDescription'),
    });
    console.log('Interview scheduled with:', input);

    // We can return a mock ID for redirection.
    const mockInterviewId = 'new-interview-id';
    return { success: true, data: { interviewId: mockInterviewId } };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to schedule interview.' };
  }
}