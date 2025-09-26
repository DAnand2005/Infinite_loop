'use server';

/**
 * @fileOverview Generates a professional interview reminder email.
 *
 * - generateReminderEmail - A function that generates the reminder email content.
 * - GenerateReminderEmailInput - The input type for the function.
 * - GenerateReminderEmailOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReminderEmailInputSchema = z.object({
  name: z.string().describe("The candidate's name."),
  jobRole: z.string().describe('The job role the candidate is applying for.'),
  companyName: z
    .string()
    .describe('The name of the company for the interview.'),
  date: z.string().describe('The date of the interview (e.g., "MMMM d, yyyy").'),
  time: z.string().describe('The time of the interview (e.g., "h:mm a").'),
});
export type GenerateReminderEmailInput = z.infer<
  typeof GenerateReminderEmailInputSchema
>;

const GenerateReminderEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line of the reminder email.'),
  body: z.string().describe('The full body content of the reminder email.'),
});
export type GenerateReminderEmailOutput = z.infer<
  typeof GenerateReminderEmailOutputSchema
>;

export async function generateReminderEmail(
  input: GenerateReminderEmailInput
): Promise<GenerateReminderEmailOutput> {
  return generateReminderEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReminderEmailPrompt',
  input: {schema: GenerateReminderEmailInputSchema},
  output: {schema: GenerateReminderEmailOutputSchema},
  prompt: `You are a helpful assistant responsible for writing professional emails.

  A candidate has a mock interview scheduled soon. Your task is to generate a reminder email for them.

  The email should:
  - Have a clear subject line reminding them of the interview.
  - Be friendly and encouraging.
  - Remind them of the key details: job role, company name, date, and time.
  - Wish them good luck.

  Candidate Name: {{name}}
  Job Role: {{jobRole}}
  Company: {{companyName}}
  Date: {{date}}
  Time: {{time}}

  Generate the subject and body for the reminder email.
  `,
});

const generateReminderEmailFlow = ai.defineFlow(
  {
    name: 'generateReminderEmailFlow',
    inputSchema: GenerateReminderEmailInputSchema,
    outputSchema: GenerateReminderEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
