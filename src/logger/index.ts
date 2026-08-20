import * as Sentry from '@sentry/react-router';
import { Logger } from 'tslog';

const levelNumberToNameMap = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

const isServer = typeof window === 'undefined';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = new Logger({
  // JSON only for server-side production logs (useful for Fly.io log drains);
  // pretty everywhere else (dev, tests, and always in the browser - nothing
  // reads browser console output as a log drain, and pretty already avoids
  // ANSI leakage on non-TTY output).
  type: isServer && isProduction ? 'json' : 'pretty',
  minLevel: process.env.NODE_ENV === 'test' ? 999 : levelNumberToNameMap['info'],
  mask: {
    keys: [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'authorization',
      'secret',
      'jwt',
    ],
    caseInsensitive: true,
  },
});

// Bridge caught-and-logged errors into Sentry. These are only console-logged
// today and invisible in Sentry (Sentry.captureException is only called from
// the top-level error boundaries in entry.server.tsx / entry.client.tsx) -
// this covers try/catch'd service errors that never reach a boundary.
logger.use((ctx) => {
  if (ctx.logLevelId >= levelNumberToNameMap['error']) {
    const carrier = ctx.args.find(
      (a) => a instanceof Error || (typeof a === 'object' && a !== null && 'error' in a),
    ) as any;
    const errorLike = carrier instanceof Error ? carrier : carrier?.error;
    const message = ctx.args.find((a) => typeof a === 'string');

    if (errorLike instanceof Error) {
      Sentry.captureException(errorLike, { extra: { message } });
    } else if (errorLike && typeof errorLike === 'object') {
      // Non-Error error-like object (e.g. Supabase's PostgrestError) - no
      // stack trace to attach, but its message/code/details are still worth
      // surfacing rather than a bare fallback message.
      Sentry.captureMessage(message ?? errorLike.message ?? 'Unknown logger.error call', {
        level: 'error',
        extra: { error: errorLike },
      });
    } else {
      Sentry.captureMessage(message ?? 'Unknown logger.error call', 'error');
    }
  }
  return ctx;
});
