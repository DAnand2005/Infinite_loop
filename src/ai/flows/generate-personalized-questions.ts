'use server';

/**
 * @fileOverview A flow to generate personalized interview questions based on resume weaknesses.
 *
 * - generatePersonalizedQuestions - A function that generates personalized interview questions.
 * - GeneratePersonalizedQuestionsInput - The input type for the generatePersonalizedQuestions function.
 * - GeneratePersonalizedQuestionsOutput - The return type for the generatePersonalizedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedQuestionsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
});
export type GeneratePersonalizedQuestionsInput = z.infer<typeof GeneratePersonalizedQuestionsInputSchema>;

const GeneratePersonalizedQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of personalized interview questions.'),
});
export type GeneratePersonalizedQuestionsOutput = z.infer<typeof GeneratePersonalizedQuestionsOutputSchema>;

export async function generatePersonalizedQuestions(input: GeneratePersonalizedQuestionsInput): Promise<GeneratePersonalizedQuestionsOutput> {
  return generatePersonalizedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedQuestionsPrompt',
  input: {schema: GeneratePersonalizedQuestionsInputSchema},
  output: {schema: GeneratePersonalizedQuestionsOutputSchema},
  prompt: `You are an expert career coach helping candidates prepare for interviews.

  Based on the following resume text, identify potential weaknesses and formulate interview questions to target those weaknesses.

  Resume Text: {{{resumeText}}}

  Provide 5 interview questions that will help the candidate address these weaknesses.
  Format each question as a single string in a JSON array.
  `,
});

const generatePersonalizedQuestionsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuestionsFlow',
    inputSchema: GeneratePersonalizedQuestionsInputSchema,
    outputSchema: GeneratePersonalizedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
