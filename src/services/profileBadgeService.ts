import type { ProfileBadge } from 'oa-shared';
import { logger } from 'src/logger';
import type { ProfileBadgeInput } from 'src/utils/profileBadges';

const getProfileBadges = async () => {
  try {
    const response = await fetch(`/api/profile-badges`);
    return (await response.json()) as ProfileBadge[];
  } catch (error) {
    logger.error('Failed to fetch profile badges', { error });
    return [];
  }
};

const createProfileBadge = async (input: ProfileBadgeInput) => {
  const response = await fetch('/api/admin/profile-badges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error creating badge' }));
    throw new Error(errorData.error || 'Error creating badge');
  }

  return (await response.json()) as ProfileBadge;
};

const updateProfileBadge = async (id: number, input: ProfileBadgeInput) => {
  const response = await fetch(`/api/admin/profile-badges/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error updating badge' }));
    throw new Error(errorData.error || 'Error updating badge');
  }

  return (await response.json()) as ProfileBadge;
};

const deleteProfileBadge = async (id: number) => {
  const response = await fetch(`/api/admin/profile-badges/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting badge' }));
    throw new Error(errorData.error || 'Error deleting badge');
  }
};

export const ProfileBadgeService = {
  createProfileBadge,
  deleteProfileBadge,
  getProfileBadges,
  updateProfileBadge,
};
