'use server';

/**
 * @fileOverview Generates a professional interview invitation email.
 *
 * - generateInterviewEmail - A function that generates the email content.
 * - GenerateInterviewEmailInput - The input type for the function.
 * - GenerateInterviewEmailOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewEmailInputSchema = z.object({
  name: z.string().describe("The candidate's name."),
  email: z.string().email().describe("The candidate's email address."),
  jobRole: z.string().describe('The job role the candidate is applying for.'),
  companyName: z
    .string()
    .describe('The name of the company for the interview.'),
  date: z.string().describe('The date of the interview (e.g., "MMMM d, yyyy").'),
  time: z.string().describe('The time of the interview (e.g., "h:mm a").'),
});
export type GenerateInterviewEmailInput = z.infer<
  typeof GenerateInterviewEmailInputSchema
>;

const GenerateInterviewEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The full body content of the email.'),
});
export type GenerateInterviewEmailOutput = z.infer<
  typeof GenerateInterviewEmailOutputSchema
>;

export async function generateInterviewEmail(
  input: GenerateInterviewEmailInput
): Promise<GenerateInterviewEmailOutput> {
  return generateInterviewEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewEmailPrompt',
  input: {schema: GenerateInterviewEmailInputSchema},
  output: {schema: GenerateInterviewEmailOutputSchema},
  prompt: `You are a helpful assistant responsible for writing professional emails.

  A candidate has scheduled a mock interview. Your task is to generate a confirmation email for them.

  The email should include:
  - A clear subject line confirming the interview.
  - A professional and friendly tone.
  - All the necessary details: job role, company name, date, and time.
  - A placeholder for a meeting link (e.g., "[Meeting Link]").

  Candidate Name: {{name}}
  Candidate Email: {{email}}
  Job Role: {{jobRole}}
  Company: {{companyName}}
  Date: {{date}}
  Time: {{time}}

  Generate the subject and body for the email.
  `,
});

const generateInterviewEmailFlow = ai.defineFlow(
  {
    name: 'generateInterviewEmailFlow',
    inputSchema: GenerateInterviewEmailInputSchema,
    outputSchema: GenerateInterviewEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
