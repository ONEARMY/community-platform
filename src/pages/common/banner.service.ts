import type { Banner } from 'oa-shared';
import { logger } from 'src/logger';

const getBanner = async () => {
  try {
    const response = await fetch('/api/banner');
    return (await response.json()) as Banner;
  } catch (error) {
    logger.error({ error });
    return null;
  }
};

export const bannerService = {
  getBanner,
};
