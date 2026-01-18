import { useLayoutEffect, useState } from 'react';

/**
 * Hook to detect if the screen width is mobile (≤ 640px)
 * @returns boolean indicating if the screen is mobile
 * Only returns true for screens with width <= 640px
 * Uses useLayoutEffect to ensure check happens synchronously before paint
 */
export const useMobile = (): boolean => {
  // Initialize with correct value if on client side, otherwise false for SSR
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 640;
    }
    return false;
  });

  useLayoutEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const checkMobile = () => {
      // Explicitly check that width is <= 640px
      // Use innerWidth for viewport width (excluding scrollbars)
      const width = window.innerWidth;
      const isMobileWidth = width <= 640;
      setIsMobile(isMobileWidth);
    };

    // Check immediately on mount (synchronously before paint)
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};
