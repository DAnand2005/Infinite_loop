'use server';

import {
  generateInterviewFeedback,
  type GenerateInterviewFeedbackInput,
} from '@/ai/flows/generate-interview-feedback';
import {
  generatePersonalizedQuestions,
  type GeneratePersonalizedQuestionsInput,
} from '@/ai/flows/generate-personalized-questions';

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
