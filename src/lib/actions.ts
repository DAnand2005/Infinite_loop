
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
import nodemailer from 'nodemailer';

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

    const [hours, minutesPart] = input.time.split(':');
    const [minutes, modifier] = minutesPart.split(' ');
    let hour = parseInt(hours);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;

    const scheduledDate = new Date(input.date);
    scheduledDate.setUTCHours(hour, parseInt(minutes), 0, 0);

    const emailContent = await generateInterviewEmail({
      name: input.name,
      email: input.email,
      jobRole: input.jobRole,
      companyName: input.companyName,
      date: format(scheduledDate, "MMMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
    });
    
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send the actual email
    await transporter.sendMail({
      from: `"AI Mock Interviewer" <${process.env.GMAIL_EMAIL}>`,
      to: input.email,
      subject: emailContent.subject,
      html: emailContent.body.replace(/\n/g, '<br>'), // Use HTML for better formatting
    });

    const reminderContent = await generateReminderEmail({
      name: input.name,
      jobRole: input.jobRole,
      companyName: input.companyName,
      date: format(scheduledDate, "MMMM d, yyyy"),
      time: format(scheduledDate, "h:mm a"),
    });

    const reminderDate = subHours(scheduledDate, 2);
    const mockInterviewId = `interview-${Date.now()}`;
    const newInterview: Interview = {
      id: mockInterviewId,
      role: input.jobRole,
      company: input.companyName,
      date: scheduledDate.toISOString(),
      status: 'Scheduled',
    }

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
    return { success: false, error: 'Failed to schedule interview. Please check server logs for email sending issues.' };
  }
}
