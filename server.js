/* eslint-disable no-undef */
import { createRequestHandler } from '@remix-run/express'
import compression from 'compression'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

dotenv.config()

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      )

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : // eslint-disable-next-line import/no-unresolved
      await import('./build/server/index.js'), // comment necessary because lint runs before build
})

const app = express()

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

const wsUrls = process.env.WS_URLS?.split(',').map((url) => url.trim())

// helmet config
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
      connectSrc: [
        "'self'",
        '*.run.app',
        'securetoken.googleapis.com',
        'firestore.googleapis.com',
        'identitytoolkit.googleapis.com',
        ...wsUrls,
      ],
      defaultSrc: [
        "'self'",
        'googletagmanager.com',
        '*.googletagmanager.com',
        'analytics.google.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
        '*.firebaseio.com',
        'googleapis.com',
      ],
      scriptSrc: [
        "'self'",
        'googletagmanager.com',
        '*.googletagmanager.com',
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
        "'unsafe-eval'",
        "'unsafe-inline'",
      ],

      frameSrc: [
        "'self'",
        'www.youtube.com',
        'youtube.com',
        'onearmy.github.io', // because PP academy is hosted there
        'donorbox.org',
      ],
      imgSrc: [
        "'self'",
        'google.com',
        '*.openstreetmap.org',
        'firebasestorage.googleapis.com',
        'cdn.jsdelivr.net', // image CDN
      ],
      objectSrc: ["'self'"],
    },
  }),
)
app.use(
  helmet.hsts({ maxAge: 31536000, preload: true, includeSubDomains: false }),
)
app.use(helmet.dnsPrefetchControl({ allow: true }))
app.use(helmet.hidePoweredBy())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy({ policy: ['origin'] }))
app.use(helmet.xssFilter())
app.use(helmet.hidePoweredBy())

app.use(function (req, res, next) {
  if (!('JSONResponse' in res)) {
    return next()
  }

  res.set('Cache-Control', 'public, max-age=31557600')
  res.json(res.JSONResponse)
})

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  )
}

app.use(express.static('build/client', { maxAge: '1h' }))

app.all('*', remixHandler)

let port = process.env.PORT || 3456 // 3456 is default port for ci

app.listen(port, () => {
  // eslint-disable-next-line no-console, no-undef
  console.log(`Express server started on http://localhost:${port}`)
})
