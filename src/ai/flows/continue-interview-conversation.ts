
'use server';

/**
 * @fileOverview A flow to manage a dynamic, conversational interview.
 *
 * This flow takes the conversation history and the latest user answer to generate
 * the next response from the AI interviewer, creating a natural, one-on-one dialogue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ContinueInterviewConversationInputSchema = z.object({
  jobRole: z.string().describe('The job role the candidate is applying for.'),
  companyName: z.string().describe('The name of the company for the interview.'),
  history: z.array(MessageSchema).describe('The history of the conversation so far.'),
  userAnswer: z.string().describe("The candidate's latest answer."),
});
export type ContinueInterviewConversationInput = z.infer<typeof ContinueInterviewConversationInputSchema>;

const ContinueInterviewConversationOutputSchema = z.object({
  interviewerResponse: z.string().describe("The AI interviewer's next question or comment."),
  endInterview: z.boolean().describe('Whether the interview should be concluded.'),
});
export type ContinueInterviewConversationOutput = z.infer<typeof ContinueInterviewConversationOutputSchema>;


export async function continueInterviewConversation(
  input: ContinueInterviewConversationInput
): Promise<ContinueInterviewConversationOutput> {
  return continueInterviewConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'continueInterviewConversationPrompt',
  input: { schema: ContinueInterviewConversationInputSchema },
  output: { schema: ContinueInterviewConversationOutputSchema },
  prompt: `You are a professional AI interviewer conducting an interview for a {{jobRole}} position at {{companyName}}.

Your persona is encouraging, professional, and insightful. Your goal is to have a natural, flowing conversation, not just a list of questions.

RULES:
1.  **Analyze and Follow Up**: Your primary task is to analyze the candidate's most recent answer and ask a relevant follow-up question.
2.  **Keep it Conversational**: Do not just fire off random questions. Your response should logically follow what the candidate just said.
3.  **Guide the Conversation**: While being conversational, ensure you guide the interview to cover key areas relevant to the job role.
4.  **Stay in Character**: You are the interviewer. Do not break character. Address the candidate directly.
5.  **Decide When to End**: After a reasonable number of exchanges (around 5-7 turns), decide if the interview has reached a natural conclusion. If so, set 'endInterview' to true and provide a concluding remark.

CONVERSATION HISTORY:
{{#each history}}
  **{{role}}**: {{content}}
{{/each}}

CANDIDATE'S LATEST ANSWER:
"{{userAnswer}}"

Based on this, provide your next response and decide if the interview should end.`,
});

const continueInterviewConversationFlow = ai.defineFlow(
  {
    name: 'continueInterviewConversationFlow',
    inputSchema: ContinueInterviewConversationInputSchema,
    outputSchema: ContinueInterviewConversationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
