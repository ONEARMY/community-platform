import type { ProfileType } from 'oa-shared';
import { logger } from 'src/logger';

const getProfileTypes = async () => {
  try {
    const response = await fetch('/api/profile-types', {
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=1800', // 30 minutes
      },
    });

    return ((await response.json()) as ProfileType[]) || [];
  } catch (error) {
    logger.error({ error });
    return [];
  }
};

export interface ProfileTypeFormData {
  name: string;
  order: number | null;
  description: string | null;
  mapPinName: string;
  isSpace: boolean;
  imageUrl: string | null;
  smallImageUrl: string | null;
}

const createProfileType = async (form: ProfileTypeFormData) => {
  const response = await fetch('/api/profile-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error creating profile type' }));
    throw new Error(errorData.error || 'Error creating profile type');
  }

  return (await response.json()) as ProfileType;
};

const updateProfileType = async (id: number, form: ProfileTypeFormData) => {
  const response = await fetch(`/api/profile-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error updating profile type' }));
    throw new Error(errorData.error || 'Error updating profile type');
  }

  return (await response.json()) as ProfileType;
};

const deleteProfileType = async (id: number) => {
  const response = await fetch(`/api/profile-types/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting profile type' }));
    throw new Error(errorData.error || 'Error deleting profile type');
  }
};
export const profileTypesService = {
  createProfileType,
  deleteProfileType,
  getProfileTypes,
  updateProfileType,
};
