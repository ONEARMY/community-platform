import type { Banner } from 'oa-shared';
import { logger } from 'src/logger';

export interface BannerFormData {
  text: string;
  url: string | null;
}

const getBanner = async () => {
  try {
    const response = await fetch('/api/banner');
    return (await response.json()) as Banner;
  } catch (error) {
    logger.error({ error });
    return null;
  }
};

const createBanner = async (form: BannerFormData) => {
  const response = await fetch('/api/admin/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error creating banner' }));
    throw new Error(errorData.error || 'Error creating banner');
  }

  return (await response.json()) as Banner;
};

const updateBanner = async (id: number, form: BannerFormData) => {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error updating banner' }));
    throw new Error(errorData.error || 'Error updating banner');
  }

  return (await response.json()) as Banner;
};

const deleteBanner = async (id: number) => {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting banner' }));
    throw new Error(errorData.error || 'Error deleting banner');
  }
};

export const bannerService = {
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};
