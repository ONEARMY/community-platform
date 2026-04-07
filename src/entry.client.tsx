import { CacheProvider } from '@emotion/react';
import * as Sentry from '@sentry/react-router';
import { startTransition, useMemo, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { SENTRY_CONFIG } from './config/config';
import { ClientStyleContext } from './styles/context';
import { createEmotionCache } from './styles/createEmotionCache';

import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,

  onRegistered(reg) {
    console.log('✅ SW Registered:', reg);
  },

  onRegisterError(error) {
    console.log('❌ SW Error:', error);
  },
});


// Register Service Worker


  // registerSW({
  //   immediate: true,
  // });


declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

Sentry.init({ ...SENTRY_CONFIG });

const ClientCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(createEmotionCache());

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    [],
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
};

startTransition(() => {
  hydrateRoot(
    document,
    <ClientCacheProvider>
      <HydratedRouter />
    </ClientCacheProvider>,
  );
});


// Track PWA Install

window.addEventListener('appinstalled', () => {
  console.log('PWA Installed');

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'pwa_installed');
  }
});

// Track Standalone Mode

if (
  window.matchMedia('(display-mode: standalone)').matches
) {
  console.log('Standalone Mode');

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'pwa_standalone_session');
  }
}

// Manual Service Worker Registration

