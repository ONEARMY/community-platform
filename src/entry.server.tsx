import { renderToPipeableStream } from 'react-dom/server'
import { ServerRouter } from 'react-router'
import { CacheProvider } from '@emotion/react'
import * as Sentry from '@sentry/react-router'
import { isbot } from 'isbot'
import { PassThrough } from 'node:stream'

import { SENTRY_CONFIG } from './config/config'
import { createEmotionCache } from './styles/createEmotionCache'

import type { EntryContext } from 'react-router'

const ABORT_DELAY = 5_000

Sentry.init({ ...SENTRY_CONFIG })

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return isbot(request.headers.get('user-agent') || '')
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={remixContext} url={request.url} />,
      {
        onAllReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = new ReadableStream({
            start(controller) {
              body.on('data', (chunk: Buffer) => {
                controller.enqueue(chunk)
              })
              body.on('end', () => {
                controller.close()
              })
              body.on('error', (err) => {
                controller.error(err)
              })
            },
          })

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const cache = createEmotionCache()

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={cache}>
        <ServerRouter context={remixContext} url={request.url} />
      </CacheProvider>,
      {
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = new ReadableStream({
            start(controller) {
              body.on('data', (chunk: Buffer) => {
                controller.enqueue(chunk)
              })
              body.on('end', () => {
                controller.close()
              })
              body.on('error', (err) => {
                controller.error(err)
              })
            },
          })

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          if (shellRendered) {
            console.error(error)
          } else {
            responseStatusCode = 500
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
