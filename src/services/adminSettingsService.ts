export interface AdminSettingsFormData {
  colorPrimary?: string;
  colorPrimaryHover?: string;
  colorAccent?: string;
  colorAccentHover?: string;
  colorSecondary?: string;
  newsCtaTitle?: string;
  newsCtaBody?: string;
  newsCtaImageUrl?: string;
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

export const adminSettingsService = { update };
