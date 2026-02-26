import styled from '@emotion/styled';
import React from 'react';
import type { CardProps } from 'theme-ui';
import { Box, Image as ThemeImage } from 'theme-ui';

import 'photoswipe/style.css';

export interface ImageGalleryThumbnailProps {
  setActiveIndex: (index: number) => void;
  allowPortrait: boolean;
  activeImageIndex: number;
  thumbnailUrl: string;
  index: number;
  alt?: string;
  name?: string;
}

export const ThumbCard = styled<CardProps & React.ComponentProps<any>>(Box)`
  cursor: pointer;
  padding: 5px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

export const ImageGalleryThumbnail = (props: ImageGalleryThumbnailProps) => {
  return (
    <ThumbCard
      data-cy="thumbnail"
      data-testid="thumbnail"
      mb={3}
      mt={4}
      opacity={props.index === props.activeImageIndex ? 1.0 : 0.5}
      onClick={() => props.setActiveIndex(props.index)}
    >
      <ThemeImage
        loading="lazy"
        src={props.thumbnailUrl}
        alt={props.alt ?? props.name}
        sx={{
          width: 100,
          height: 67,
          objectFit: props.allowPortrait ? 'contain' : 'cover',
          borderRadius: 1,
          border: '1px solid offWhite',
        }}
        crossOrigin=""
      />
    </ThumbCard>
  );
};
