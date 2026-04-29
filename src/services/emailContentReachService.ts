import { EmailContentReach, SelectValue } from 'oa-shared';

const getAll = async (): Promise<EmailContentReach[] | null> => {
  try {
    const response = await fetch('/api/email-content-reach');
    return (await response.json()) as EmailContentReach[];
  } catch (error) {
    console.error({ error });
    return null;
  }
};

const getAllAsSelectValue = async (): Promise<SelectValue[] | null> => {
  const all = await getAll();
  if (all) {
    const emailContentReach = all.map((reach) => {
      return EmailContentReach.toNotificationsFormField(reach);
    });

    return emailContentReach as SelectValue[];
  }

  return null;
};

export const emailContentReachService = {
  getAllAsSelectValue,
};
