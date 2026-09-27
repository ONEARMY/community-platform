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

logger.use((ctx) => {
  if (ctx.logLevelId >= levelNumberToNameMap['error']) {
    const message = ctx.args.find((a) => typeof a === 'string') as string | undefined;
    const objects = ctx.args.filter((a) => typeof a === 'object' && a !== null) as Record<
      string,
      any
    >[];

    const error = [...objects, ...objects.map((o) => o.error)].find((a) => a instanceof Error);

    if (error) {
      Sentry.captureException(error, { extra: { message } });
    } else {
      const errorLike = objects.find(
        (o) => typeof o.message === 'string' || typeof o.error === 'object',
      );
      Sentry.captureMessage(message ?? errorLike?.message ?? 'Unknown logger.error call', {
        level: 'error',
        extra: errorLike ? { error: errorLike } : undefined,
      });
    }
  }
  return ctx;
});
