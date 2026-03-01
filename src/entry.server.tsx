import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import * as Sentry from '@sentry/react-router';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { SENTRY_CONFIG } from './config/config';
import { createEmotionCache } from './styles/createEmotionCache';

const ABORT_DELAY = 5_000;

Sentry.init({ ...SENTRY_CONFIG });

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  return isbot(request.headers.get('user-agent') || '')
    ? handleBotRequest(request, responseStatusCode, responseHeaders, context)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, context);
}

async function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  try {
    const stream = await renderToReadableStream(
      <ServerRouter context={context} url={request.url} />,
      {
        signal: controller.signal,
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      },
    );

    await stream.allReady;
    clearTimeout(timeoutId);

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(stream, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  try {
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    const stream = await renderToReadableStream(
      <CacheProvider value={cache}>
        <ServerRouter context={context} url={request.url} />
      </CacheProvider>,
      {
        signal: controller.signal,
        onError(error: unknown) {
          console.error(error);
          Sentry.captureException(error);
          if (responseStatusCode === 200) {
            responseStatusCode = 500;
          }
        },
      },
    );

    // Wait for the full shell to be ready before style extraction
    await stream.allReady;
    clearTimeout(timeoutId);

    // Read the full HTML string from the stream
    const html = await new Response(stream).text();

    // Extract critical CSS and inject into <head>
    const chunks = extractCriticalToChunks(html);
    const styleTags = constructStyleTagsFromChunks(chunks);
    const htmlWithStyles = html.replace('<head>', `<head>${styleTags}`);

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(htmlWithStyles, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
