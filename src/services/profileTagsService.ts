import type { ProfileTag } from 'oa-shared';

const getAllTags = async () => {
  try {
    const response = await fetch('/api/profile-tags');

    const profileTags = (await response.json()) as ProfileTag[];

    return profileTags;
  } catch (error) {
    console.error({ error });
    return [];
  }
};

export const profileTagsService = {
  getAllTags,
};
