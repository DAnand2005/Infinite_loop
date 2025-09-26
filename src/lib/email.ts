
import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// The transporter configuration reads the credentials from the .env.local file.
// These environment variables are only available on the server-side.
const smtpOptions = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  // Ensure that GMAIL_EMAIL is defined before creating the transport
  if (!process.env.GMAIL_EMAIL) {
    throw new Error('GMAIL_EMAIL environment variable is not set.');
  }

  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: `"AI Mock Interviewer" <${process.env.GMAIL_EMAIL}>`,
    ...data,
  });
};
