import { Resend } from 'resend';

// Initialize the Resend client with the API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string; // Optional: defaults to a generic noreply if not provided
};

/**
 * Utility function to send emails from the application using Resend.
 * Ensure you have verified your domain on Resend.
 */
export async function sendEmail({ to, subject, html, text, from }: SendEmailParams) {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured.");
    return { error: new Error("Resend is not configured") };
  }

  // Use a default sender if not provided (make sure to replace mbconsultech.com with the actual verified domain if different)
  const sender = from || 'MB Consultech <noreply@mbconsultech.com>';

  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // fallback strip html for text version
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error sending email:", error);
    return { error };
  }
}
