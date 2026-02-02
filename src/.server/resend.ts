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

type SendEmailsArgs = {
  from: string;
  subject: string;
  emails: { template: ReactNode; to: string }[];
};

export async function sendBatchEmails({ from, subject, emails }: SendEmailsArgs) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Batches of 100 emails
  // https://api.resend.com/emails/batch
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100);
    const emailsToSend = batch.map((email) => ({
      from,
      to: email.to,
      subject,
      react: email.template,
    }));

    if (i > 0) {
      // To avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await resend.batch
      .send(emailsToSend, {
        idempotencyKey: crypto.randomUUID(),
      })
      .catch((error: any) => {
        console.error(error?.message || error);
      });
  }

  return;
}
