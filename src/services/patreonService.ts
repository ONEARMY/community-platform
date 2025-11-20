import type { IPatreonUser } from 'oa-shared';

const getCurrentUserPatreon = async () => {
  try {
    const patreonData = await fetch('/api/patreon');

    return (await patreonData.json()) as {
      patreon: IPatreonUser;
      isSupporter: boolean;
    };
  } catch (err) {
    console.error(err);
  }

  return null;
};

const disconnectUserPatreon = async () => {
  const result = await fetch('/api/patreon', { method: 'DELETE' });

  return result.ok;
};

export const patreonService = {
  getCurrentUserPatreon,
  disconnectUserPatreon,
};
