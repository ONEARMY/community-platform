import { useEffect, useState } from 'react';
import { Banner, Icon } from 'oa-components';
import { bannerService } from 'src/pages/common/banner.service';
import { IconButton, Text } from 'theme-ui';

import type { Banner as BannerModel } from 'oa-shared';

export const AlertBanner = () => {
  const [banner, setBanner] = useState<(BannerModel & { show: boolean }) | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      const banner = await bannerService.getBanner();

      if (banner) {
        const didUserCloseBefore = sessionStorage.getItem(`bannerClosed_${banner.id}`) === 'true';
        if (!didUserCloseBefore) {
          setBanner({ ...banner, show: true });
        }
      }
    };

    fetchBanner();
  }, []);

  const onClose = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (banner) {
      sessionStorage.setItem(`bannerClosed_${banner.id}`, 'true');
      setBanner({ ...banner, show: false });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose(e);
    }
  };

  if (!banner?.text || !banner.show) {
    return null;
  }

  const bannerContent = (
    <Banner
      variant="accent"
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <div style={{ width: '32px' }} />
      <Text>{banner.text}</Text>
      <IconButton
        onClick={onClose}
        onKeyDown={onKeyDown}
        sx={{
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Icon glyph="close" />
      </IconButton>
    </Banner>
  );

  if (banner.url) {
    return (
      <a href={banner.url} target="_blank" rel="noreferrer">
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};
