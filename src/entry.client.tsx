import { CacheProvider } from '@emotion/react';
import * as Sentry from '@sentry/react-router';
import { startTransition, useMemo, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { SENTRY_CONFIG } from './config/config';
import { ClientStyleContext } from './styles/context';
import { createEmotionCache } from './styles/createEmotionCache';

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

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  (async () => {
    try {
      const { Workbox } = await import('workbox-window');
      const wb = new Workbox('/sw.js');

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          // TODO: show toast
          console.log('New version available! Refresh to update.');
        }
      });

      await wb.register();
    } catch (error) {
      console.debug('Service worker registration skipped:', error.message);
    }
  })();
}
