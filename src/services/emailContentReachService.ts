import type { EmailContentReach } from 'oa-shared';

const getAll = async (): Promise<EmailContentReach[] | null> => {
  try {
    const response = await fetch('/api/email-content-reach');
    return (await response.json()) as EmailContentReach[];
  } catch (error) {
    console.error({ error });
    return null;
  }
};

export const emailContentReachService = {
  getAll,
};
