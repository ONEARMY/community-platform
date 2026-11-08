import type { JSONContent } from '@tiptap/core';

export interface AdminSettingsFormData {
  colorPrimary?: string;
  colorPrimaryHover?: string;
  colorAccent?: string;
  colorAccentHover?: string;
  colorSecondary?: string;
  newsCtaTitle?: string;
  newsCtaBody?: string;
  newsCtaImageUrl?: string;
  newsCtaHelpLink?: string;
  welcomeEmailFromName?: string;
  welcomeEmailSubject?: string;
  welcomeEmailContent?: JSONContent | null;
}

const update = async (form: AdminSettingsFormData) => {
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving settings' }));
    throw new Error(errorData.error || 'Error saving settings');
  }
};

const sendWelcomeEmailPreview = async (draft: {
  fromName: string;
  subject: string;
  content: JSONContent | null;
}) => {
  const response = await fetch('/api/admin/welcome-email/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error sending test email' }));
    throw new Error(errorData.error || 'Error sending test email');
  }
};

export const adminSettingsService = { update, sendWelcomeEmailPreview };
