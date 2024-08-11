import { createRequestHandler } from '@remix-run/express'
import compression from 'compression'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

// TODO: this entire file needs to be reviewed :)
dotenv.config()

const viteDevServer =
  import.meta.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      )

let app = express()

app.use(compression())
app.use(express.static('build/client', { maxAge: '1h' }))

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
      defaultSrc: [
        "'self'",
        'googletagmanager.com',
        '*.googletagmanager.com',
        'analytics.google.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
      ],
      scriptSrc: [
        "'self'",
        'googletagmanager.com',
        '*.googletagmanager.com',
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        '*.analytics.google.com',
        '*.google-analytics.com',
      ],

      frameSrc: ["'self'", 'www.youtube.com', 'youtube.com'],
      imgSrc: ["'self'"],
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
app.use(helmet.referrerPolicy({ policy: ['origin', 'unsafe-url'] }))
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
  app.use(
    '/assets',
    express.static('build/client/assets', {
      immutable: true,
      maxAge: '1y',
    }),
  )
}

app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
      : await import('../build/server/index.js'),
  }),
)

let port = import.meta.env.PORT || 3000

app.listen(port, () => {
  // eslint-disable-next-line no-console, no-undef
  console.log(`Express server started on http://localhost:${port}`)
})
