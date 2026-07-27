import type { PhotoSwipeOptions } from 'photoswipe/lightbox';
import { useEffect } from 'react';
import { usePhotoSwipeLightbox } from './usePhotoSwipeLightbox';

interface Props {
  images: { src: string; alt?: string }[];
  photoSwipeOptions?: PhotoSwipeOptions;
}

export const useImageLightbox = ({ images, photoSwipeOptions }: Props) => {
  const { open } = usePhotoSwipeLightbox({
    images,
    photoSwipeOptions,
  });

  useEffect(() => {
    const imageElements: HTMLImageElement[] = [];

    for (const img of images) {
      const found = document.querySelector(`img[src="${img.src}"]`);
      if (found) {
        imageElements.push(found as HTMLImageElement);
      }
    }

    if (imageElements.length === 0) {
      return;
    }

    const cleanupFns: (() => void)[] = [];

    imageElements.forEach((img, index) => {
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
      imageElements.forEach((img) => {
        img.style.cursor = '';
      });
    };
  }, [images, open]);
};
