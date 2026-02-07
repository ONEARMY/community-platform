import type { PhotoSwipeOptions } from 'photoswipe/lightbox';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { useCallback, useEffect, useRef } from 'react';

import 'photoswipe/style.css';

export interface UsePhotoSwipeLightboxProps {
  images: { src: string; alt?: string }[];
  photoSwipeOptions?: PhotoSwipeOptions;
}

export const usePhotoSwipeLightbox = ({
  images,
  photoSwipeOptions,
}: UsePhotoSwipeLightboxProps) => {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !images.length) {
      return;
    }

    // Initializes the Photoswipe lightbox to use the provided images
    lightboxRef.current = new PhotoSwipeLightbox({
      dataSource: images.map((image) => ({
        src: image.src,
        alt: image.alt,
      })),
      pswpModule: () => import('photoswipe'),
      ...(photoSwipeOptions ?? {}),
    });

    // Before opening the lightbox, calculates the image sizes and
    // refreshes lightbox slide to adapt to these updated dimensions
    lightboxRef.current.on('beforeOpen', () => {
      const photoswipe = lightboxRef.current?.pswp;
      const dataSource = photoswipe?.options?.dataSource;

      if (Array.isArray(dataSource)) {
        dataSource.forEach((source, index) => {
          const img = new Image();
          img.onload = () => {
            source.width = img.naturalWidth;
            source.height = img.naturalHeight;
            photoswipe?.refreshSlideContent(index);
          };
          img.src = source.src as string;
        });
      }
    });

    lightboxRef.current.init();

    return () => {
      lightboxRef.current?.destroy();
      lightboxRef.current = null;
    };
  }, [images]);

  // Prevent native hash scrolling and handle it ourselves
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let originalHash = '';

    const preventNativeHashScroll = () => {
      if (window.location.hash) {
        originalHash = window.location.hash;
        // Remove hash completely to prevent any native scrolling
        window.history.replaceState(null, '', window.location.pathname + window.location.search);

        // Prevent any scroll restoration
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
      }
    };

    // Restore hash after component mounts
    const restoreHash = () => {
      if (originalHash) {
        setTimeout(() => {
          window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search + originalHash,
          );
        }, 50);
      }
    };

    preventNativeHashScroll();
    restoreHash();

    return () => {
      // Restore scroll restoration on cleanup
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const open = useCallback((index: number) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!lightboxRef.current) {
      return;
    }
    lightboxRef.current.loadAndOpen(index);
  }, []);

  return {
    open,
    lightboxRef,
  };
};
