import type { SendMessage } from 'oa-shared';

const sendMessage = async (data: SendMessage): Promise<void> => {
  const formData = new FormData();

  formData.append('to', data.to);
  formData.append('message', data.message);
  formData.append('name', data.name);

  const response = await fetch('/api/messages', {
    method: 'POST',
    body: formData,
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving research' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving research';
    throw new Error(errorMessage, { cause: response.status });
  }

  return;
};

export const messageService = {
  sendMessage,
};
