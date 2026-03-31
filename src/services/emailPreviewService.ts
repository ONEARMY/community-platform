import { DBMedia, NewsDTO, NewsFormData } from 'oa-shared';
import { createFormData } from './formDataHelper';

const send = async (form: NewsFormData) => {
  const body = createFormData<NewsDTO>({
    title: form.title,
    body: form.body,
    category: Number(form.category?.value) || null,
    heroImage: form.heroImage ? DBMedia.fromPublicMedia(form.heroImage) : null,
    isDraft: form.isDraft,
    profileBadge: Number(form.profileBadge?.value) || null,
    tags: form.tags || null,
  });

  const response = await fetch(`/api/email-preview`, {
    method: 'POST',
    body,
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error sending email preview' }));
    const errorMessage = errorData.error || errorData.message || 'Error sending email preview';
    throw new Error(errorMessage, { cause: response.status });
  }

  return;
};

export const emailPreviewService = {
  send,
};
