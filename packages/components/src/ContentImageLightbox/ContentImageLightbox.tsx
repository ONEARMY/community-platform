import { useEffect, useRef, useState } from 'react';

import { usePhotoSwipeLightbox } from '../hooks/usePhotoSwipeLightbox';

import type { PhotoSwipeOptions } from 'photoswipe/lightbox';

interface Props {
  children: React.ReactNode;
  selector?: string;
  photoSwipeOptions?: PhotoSwipeOptions;
  prependImages?: HTMLImageElement[];
}

export const ContentImageLightbox = ({
  children,
  selector = 'img',
  photoSwipeOptions,
  prependImages = [],
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<{ src: string; alt?: string }[]>([]);

  const { open } = usePhotoSwipeLightbox({
    images,
    photoSwipeOptions,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all images in the content body matching the selector
    const imageElements = Array.from(
      containerRef.current.querySelectorAll(selector),
    ) as HTMLImageElement[];

    const allImages = [...prependImages, ...imageElements];

    if (allImages.length === 0) {
      setImages([]);
      return;
    }

    // Build the data source for the lightbox hook
    const foundImages = allImages.map((img) => ({
      src: img.src,
      alt: img.alt,
    }));

    setImages(foundImages);

    // Attach click listeners to HTML images
    const cleanupFns: (() => void)[] = [];

    allImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        open(index);
      };

      img.addEventListener('click', handleClick);
      cleanupFns.push(() => img.removeEventListener('click', handleClick));
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      allImages.forEach((img) => {
        img.style.cursor = '';
      });
    };
  }, [prependImages]);

  return <div ref={containerRef}>{children}</div>;
};
