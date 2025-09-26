'use server';

/**
 * @fileOverview Generates a summary report of the interview, highlighting strengths, weaknesses, and suggested improvements.
 *
 * - generateInterviewFeedback - A function that handles the generation of interview feedback.
 * - GenerateInterviewFeedbackInput - The input type for the generateInterviewFeedback function.
 * - GenerateInterviewFeedbackOutput - The return type for the generateInterviewFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewFeedbackInputSchema = z.object({
  resume: z.string().describe('The resume of the candidate.'),
  jobDescription: z.string().describe('The job description for the role.'),
  interviewTranscript: z.string().describe('The transcript of the interview.'),
});
export type GenerateInterviewFeedbackInput = z.infer<
  typeof GenerateInterviewFeedbackInputSchema
>;

const GenerateInterviewFeedbackOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the candidate.'),
  weaknesses: z.string().describe('The weaknesses of the candidate.'),
  suggestedImprovements: z
    .string()
    .describe('Suggested improvements for the candidate.'),
});
export type GenerateInterviewFeedbackOutput = z.infer<
  typeof GenerateInterviewFeedbackOutputSchema
>;

export async function generateInterviewFeedback(
  input: GenerateInterviewFeedbackInput
): Promise<GenerateInterviewFeedbackOutput> {
  return generateInterviewFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewFeedbackPrompt',
  input: {schema: GenerateInterviewFeedbackInputSchema},
  output: {schema: GenerateInterviewFeedbackOutputSchema},
  prompt: `You are an AI interview feedback generator. Based on the candidate's resume, job description, and interview transcript, you will generate a summary report of the candidate's performance, highlighting strengths, weaknesses, and suggested improvements.

Resume:
{{resume}}

Job Description:
{{jobDescription}}

Interview Transcript:
{{interviewTranscript}}`,
});

const generateInterviewFeedbackFlow = ai.defineFlow(
  {
    name: 'generateInterviewFeedbackFlow',
    inputSchema: GenerateInterviewFeedbackInputSchema,
    outputSchema: GenerateInterviewFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
