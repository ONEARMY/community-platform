import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';
import { createRequestHandler } from 'react-router';

const isProd = process.env.NODE_ENV === 'production';

const viteDevServer = isProd
  ? undefined
  : await import('vite').then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

const app = new Hono();

app.onError((err, c) => {
  // React Router handles all route actions internally and we're now catching HTTPException within the actions themselves, app.onError won't catch those errors.
  // However, it's still a good safety net for:
  // - Errors in Hono middleware (compression, secure headers)
  // - Errors in static file serving
  // - Any unexpected errors at the Hono layer

  // Handle HTTPException (from hono/http-exception)
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  // Return generic error response
  return c.json(
    {
      error: 'Internal Server Error',
      status: 500,
    },
    500,
  );
});

// Compression
app.use(compress());

app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api/documents')) {
    return next(); // Skip limit — Bun's 300MB cap is the backstop
  }
  return bodyLimit({ maxSize: 10 * 1024 * 1024 })(c, next);
});

// Security headers (replaces helmet)
const wsUrls = process.env.WS_URLS?.split(',').map((url) => url.trim()) ?? [];

const imgSrc = [
  "'self'",
  'data:',
  'blob:',
  'google.com',
  '*.openstreetmap.org',
  'onearmy.github.io',
  'cdn.jsdelivr.net',
  '*.google-analytics.com',
  '*.patreonusercontent.com',
  '*.basemaps.cartocdn.com',
  '*.supabase.co',
  "http://127.0.0.1:54321",
  "http://127.0.0.1:3000",
  "https://community.preciousplastic.com",
  process.env.SUPABASE_API_URL,
].filter(Boolean);




app.use(
  secureHeaders({
    contentSecurityPolicy: {
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
      connectSrc: [
        "'self'",
        "blob:", // ⭐ ADD THIS
        '*.run.app',
        'securetoken.googleapis.com',
        'identitytoolkit.googleapis.com',
        '*.openstreetmap.org',
        '*.google-analytics.com',
        '*.cloudfunctions.net',
        'sentry.io',
        '*.sentry.io',
        ...wsUrls,
      ],
      defaultSrc: [
        "'self'",
        'googletagmanager.com',
        '*.googletagmanager.com',
        'analytics.google.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
        'googleapis.com',
      ],
      scriptSrc: [
        "'self'",
        "blob:", // ⭐ ADD THIS
        'googletagmanager.com',
        '*.googletagmanager.com',
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
        'www.youtube.com',
        'donorbox.org',
        "'unsafe-eval'",
        "'unsafe-inline'",
      ],
      frameSrc: [
        "'self'",
        'onearmy.github.io',
        '*.youtube.com',
        '*.donorbox.org',
        'donorbox.org',
        '*.run.app',
        '*.netlify.app',
        'projectkamp.com',
        '*.projectkamp.com',
        'preciousplastic.com',
        '*.preciousplastic.com',
        'fixing.fashion',
        '*.fixing.fashion',
      ],
      imgSrc: imgSrc,
      objectSrc: ["'self'"],
      upgradeInsecureRequests: isProd ? [] : undefined,
    },
    strictTransportSecurity: isProd ? 'max-age=31536000; preload' : false,
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'origin',
    xXssProtection: '1; mode=block',
    xDnsPrefetchControl: 'on',
  }),
);

// React Router request handler
const handler = createRequestHandler(
  viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
    : await import('./build/server/index.js'),
);

const port = Number(process.env.PORT) || 3456; // 3456 is default port for ci

if (isProd) {
  // Fingerprinted assets — cache forever
  app.use(
    '/assets/*',
    serveStatic({
      root: './build/client',
      onFound: (_path, c) => {
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
      },
    }),
  );


  app.get('/manifest.webmanifest', (c) => {
  const APP_NAME = process.env.APP_NAME || 'Community';
  const THEME_COLOR = process.env.THEME_COLOR || '#000000';
  const SHORT_NAME = process.env.SHORT_NAME || 'Community';

  return c.json({
    name: APP_NAME,
    short_name: SHORT_NAME,
    start_url: '/academy/',
    scope: '/academy/',
    display: 'standalone',
    theme_color: THEME_COLOR,
    background_color: '#ffffff',
    icons: [
      {
        src: '/academy/icon/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/academy/icon/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
});

  // Serve PWA files explicitly
  // app.use(
  //   '/sw.js',
  //   serveStatic({
  //     root: './build/client',
  //   }),
  // );

  app.use(
    '/manifest.webmanifest',
    serveStatic({
      root: './build/client',
    }),
  );

  app.use(
    '/workbox-*.js',
    serveStatic({
      root: './build/client',
    }),
  );

  // Other static files — cache for 1 hour
  app.use(
    '*',
    serveStatic({
      root: './build/client',
      onFound: (_path, c) => {
        c.header('Cache-Control', 'public, max-age=3600');
      },
    }),
  );

  // All remaining requests go to React Router
  app.all('*', (c) => handler(c.req.raw));

  Bun.serve({
    port,
    hostname: '0.0.0.0',
    fetch: app.fetch,
    maxRequestBodySize: 300 * 1024 * 1024, // Must accommodate /api/documents - protected by Hono middleware
  });

  console.log(`Hono server started on http://0.0.0.0:${port}`);
} else {
  // Development: Node-compatible HTTP server so Vite middleware works
  const http = await import('node:http');
  const { getRequestListener } = await import('@hono/node-server');

  // All requests go to React Router
  app.all('*', (c) => handler(c.req.raw));

  const honoListener = getRequestListener(app.fetch);

  const server = http.createServer((req, res) => {
    // Vite middleware handles HMR, module transforms, and client assets.
    // When it doesn't handle the request it calls next(), falling through to Hono.
    viteDevServer.middlewares(req, res, () => {
      honoListener(req, res);
    });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Hono dev server started on http://0.0.0.0:${port}`);
  });
}