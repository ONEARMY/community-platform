import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import type { CardProps } from 'theme-ui';
import { Box, Image as ThemeImage } from 'theme-ui';
import { Loader } from '../Loader/Loader';

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
  const [thumbnailLoaded, setThumbnailLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if image is already loaded (for hydration mismatch cases)
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setThumbnailLoaded(true);
    }
  }, [props.index]);

  return (
    <>
      {!thumbnailLoaded && <Loader sx={{ mb: 3, mt: 4, width: 100, height: 67 }} />}
      <ThumbCard
        data-cy="thumbnail"
        data-testid="thumbnail"
        mb={3}
        mt={4}
        opacity={props.index === props.activeImageIndex ? 1.0 : 0.5}
        onClick={() => props.setActiveIndex(props.index)}
      >
        <ThemeImage
          ref={imgRef}
          loading="lazy"
          src={props.thumbnailUrl}
          alt={props.alt ?? props.name}
          onLoad={() => setThumbnailLoaded(true)}
          onError={() => setThumbnailLoaded(true)}
          sx={{
            width: thumbnailLoaded ? 100 : 0,
            height: 67,
            objectFit: props.allowPortrait ? 'contain' : 'cover',
            borderRadius: 1,
            border: '1px solid offWhite',
          }}
          crossOrigin=""
        />
      </ThumbCard>
    </>
  );
};
