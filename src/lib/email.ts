import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// This function should only be called from server-side code.
export const sendEmail = async (data: EmailPayload) => {
  const { GMAIL_EMAIL, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
    console.error("Missing GMAIL_EMAIL or GMAIL_APP_PASSWORD in environment");
    // In a real app, you might not want to throw an error that crashes the server,
    // but for this action, it's critical, so we'll make it explicit.
    throw new Error("Missing email credentials in server environment.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // true for 465, false for 587
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"AI Mock Interviewer" <${GMAIL_EMAIL}>`,
      ...data,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email failed to send:", err);
    throw new Error("Failed to send email.");
  }
};
