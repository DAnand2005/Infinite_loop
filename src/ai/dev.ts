import { config } from 'dotenv';
config();

import '@/ai/flows/generate-interview-feedback.ts';
import '@/ai/flows/generate-personalized-questions.ts';
import '@/ai/flows/generate-interview-email.ts';
import '@/ai/flows/generate-reminder-email.ts';
import '@/ai/flows/generate-speech.ts';
