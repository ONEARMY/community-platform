import * as React from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SCRIPT_ID = 'cf-turnstile-script';

// Cloudflare's published "always passes" test sitekey - used as the default
// wherever a real sitekey isn't configured (local dev, CI, forks of this project).
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

const loadTurnstileScript = () =>
  new Promise<void>((resolve) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve());
    document.head.appendChild(script);
  });

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export const Turnstile = ({ siteKey, onVerify, onExpire }: TurnstileProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const [hasError, setHasError] = React.useState(false);

  // Callers (e.g. a react-final-form field) commonly pass a new onVerify/onExpire
  // function identity on every render. Reading them via ref keeps the widget's
  // lifecycle tied only to siteKey, so a parent re-render doesn't tear down and
  // recreate the widget mid-verification.
  const onVerifyRef = React.useRef(onVerify);
  onVerifyRef.current = onVerify;
  const onExpireRef = React.useRef(onExpire);
  onExpireRef.current = onExpire;

  React.useEffect(() => {
    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          setHasError(false);
          onVerifyRef.current(token);
        },
        'error-callback': () => {
          // The widget failed to load/verify (network issue, ad blocker, Cloudflare
          // outage). Clear any stale token so the field goes back to invalid instead
          // of silently keeping a submit button enabled with a token that will never
          // pass server-side verification.
          setHasError(true);
          onVerifyRef.current('');
        },
        'expired-callback': () => {
          onVerifyRef.current('');
          onExpireRef.current?.();
        },
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  const handleRetry = () => {
    if (widgetIdRef.current && window.turnstile) {
      setHasError(false);
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return (
    <div>
      <div ref={containerRef} />
      {hasError && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          Verification failed to load.
          <button type="button" onClick={handleRetry} className="underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
};
