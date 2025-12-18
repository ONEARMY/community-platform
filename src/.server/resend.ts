import { Resend } from 'resend';
import type { ReactNode } from 'react';

type SendEmailArgs = {
  to: string;
  from: string;
  subject: string;
  emailTemplate: ReactNode;
};

export async function sendEmail({ from, to, subject, emailTemplate }: SendEmailArgs) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.emails.send(
    {
      from,
      to,
      subject,
      react: emailTemplate,
    },
    {
      idempotencyKey: crypto.randomUUID(),
    },
  );

  return { error: response.error?.message };
}
