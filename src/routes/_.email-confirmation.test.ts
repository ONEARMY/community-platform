import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action, loader } from './_.email-confirmation';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/secretsService.server', () => ({
  getSecret: vi.fn().mockResolvedValue('test-turnstile-site-key'),
}));

const setup = (opts: {
  // biome-ignore lint/suspicious/noExplicitAny: auth claims stub or null
  claims?: any;
  // biome-ignore lint/suspicious/noExplicitAny: verified user stub or null
  verifyUser?: any;
  // biome-ignore lint/suspicious/noExplicitAny: profile stub or null
  profile?: any;
  hasApplication?: boolean;
  resendError?: { code: string } | null;
}) => {
  const getClaims = vi.fn().mockResolvedValue({ data: { claims: opts.claims ?? null } });
  const verifyOtp = vi.fn().mockResolvedValue({ data: { user: opts.verifyUser ?? null } });
  const resend = vi.fn().mockResolvedValue({ data: {}, error: opts.resendError ?? null });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims, verifyOtp, resend } },
    headers: new Headers(),
  });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getByAuthId: vi.fn().mockResolvedValue(opts.profile ?? null) };
  });

  (OrganisationApplicationsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return { existsByAuthId: vi.fn().mockResolvedValue(opts.hasApplication ?? false) };
    },
  );

  return { verifyOtp, resend };
};

// biome-ignore lint/suspicious/noExplicitAny: minimal args stubs
const loaderArgs = (url: string) => ({ request: new Request(url), params: {}, context: {} }) as any;
const actionArgs = (url: string, fields: Record<string, string> = {}) =>
  ({
    request: new Request(url, { method: 'POST', body: new URLSearchParams(fields) }),
    params: {},
    context: {},
    // biome-ignore lint/suspicious/noExplicitAny: minimal args stubs
  }) as any;

type DataResult = { data: unknown; init: ResponseInit | null };

const runAction = async (url: string, fields?: Record<string, string>) =>
  (await action(actionArgs(url, fields))) as DataResult;

const resendFields = {
  intent: 'resend',
  email: 'someone@example.com',
  'cf-turnstile-token': 'captcha-token',
};

describe('email-confirmation — organisation redirect funnel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loader', () => {
    it('redirects an authenticated applicant with no profile to /organisation-application', async () => {
      setup({ claims: { sub: 'auth-1' }, profile: null, hasApplication: true });

      const res = (await loader(
        loaderArgs('http://localhost/email-confirmation?flow=organisation'),
      )) as Response;

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/organisation-application');
    });

    it('redirects an authenticated user who already has a profile to /settings/profile', async () => {
      setup({ claims: { sub: 'auth-1' }, profile: { id: 1 } });

      const res = (await loader(loaderArgs('http://localhost/email-confirmation'))) as Response;

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/settings/profile');
    });
  });

  describe('action', () => {
    it('redirects a verified applicant with no profile to /organisation-application', async () => {
      setup({ verifyUser: { id: 'auth-1' }, profile: null, hasApplication: true });

      const res = (await action(
        actionArgs('http://localhost/email-confirmation?token=abc&flow=organisation'),
      )) as Response;

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/organisation-application');
    });

    it('redirects a verified user with no application to /setup-email-preferences', async () => {
      setup({ verifyUser: { id: 'auth-1' }, profile: null, hasApplication: false });

      const res = (await action(
        actionArgs('http://localhost/email-confirmation?token=abc'),
      )) as Response;

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/setup-email-preferences');
    });
  });
});

describe('email-confirmation — expired link', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('offers to send a new link when the token cannot be verified', async () => {
    const { resend } = setup({ verifyUser: null });

    const res = await runAction('http://localhost/email-confirmation?token=expired');

    expect(res.init?.status).toBe(400);
    expect(res.data).toEqual({ error: 'Your link has expired or is invalid', canResend: true });
    expect(resend).not.toHaveBeenCalled();
  });

  it('sends a new link to the given email without verifying the old token', async () => {
    const { verifyOtp, resend } = setup({});

    const res = await runAction('http://localhost/email-confirmation?token=expired', resendFields);

    expect(verifyOtp).not.toHaveBeenCalled();
    expect(resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'someone@example.com',
      options: {
        emailRedirectTo: 'http://localhost/email-confirmation',
        captchaToken: 'captcha-token',
      },
    });
    expect(res.data).toEqual({ resent: true });
  });

  it('keeps the organisation flow in the new link', async () => {
    const { resend } = setup({});

    await runAction(
      'http://localhost/email-confirmation?token=expired&flow=organisation',
      resendFields,
    );

    expect(resend).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          emailRedirectTo: 'http://localhost/email-confirmation?flow=organisation',
        }),
      }),
    );
  });

  it('asks the user to wait when Supabase rate-limits the resend', async () => {
    setup({ resendError: { code: 'over_email_send_rate_limit' } });

    const res = await runAction('http://localhost/email-confirmation?token=expired', resendFields);

    expect(res.init?.status).toBe(400);
    expect(res.data).toEqual({
      error: 'Please wait a minute before requesting another link.',
      canResend: true,
    });
  });

  it('shows a generic message when the resend fails for another reason', async () => {
    setup({ resendError: { code: 'captcha_failed' } });

    const res = await runAction('http://localhost/email-confirmation?token=expired', resendFields);

    expect(res.data).toEqual({
      error: "We couldn't send a new link right now. Please try again in a moment.",
      canResend: true,
    });
  });
});
