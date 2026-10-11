import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './_.sign-in';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/tenantSettingsService.server');
vi.mock('src/services/secretsService.server', () => ({
  getSecret: vi.fn().mockResolvedValue('test-turnstile-site-key'),
}));

type DataResult = { data: unknown; init: ResponseInit | null };

const setup = (opts: { signInError?: { code: string }; resendError?: { code: string } }) => {
  const signInWithPassword = vi.fn().mockResolvedValue({
    data: { user: opts.signInError ? null : { id: 'auth-1' } },
    error: opts.signInError ?? null,
  });
  const resend = vi.fn().mockResolvedValue({ data: {}, error: opts.resendError ?? null });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { signInWithPassword, resend } },
    headers: new Headers(),
  });

  return { signInWithPassword, resend };
};

const runAction = async (fields: Record<string, string>) => {
  const request = new Request('http://localhost/sign-in', {
    method: 'POST',
    body: new URLSearchParams(fields),
  });

  // biome-ignore lint/suspicious/noExplicitAny: minimal action args stub
  return (await action({ request, params: {}, context: {} } as any)) as DataResult;
};

const credentials = {
  email: 'new@example.com',
  password: 'hunter2hunter2',
  'cf-turnstile-token': 'captcha-token',
};

describe('signing in with an unconfirmed email', () => {
  beforeEach(() => vi.clearAllMocks());

  it('tells the user their email is not confirmed without resending the link', async () => {
    const { resend } = setup({ signInError: { code: 'email_not_confirmed' } });

    const res = await runAction(credentials);

    expect(resend).not.toHaveBeenCalled();
    expect(res.data).toEqual({ email: 'new@example.com', emailNotConfirmed: true });
  });

  it('resends the confirmation email when asked to', async () => {
    const { signInWithPassword, resend } = setup({});

    const res = await runAction({ ...credentials, intent: 'resend-confirmation' });

    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'new@example.com',
      options: {
        emailRedirectTo: 'http://localhost/email-confirmation',
        captchaToken: 'captcha-token',
      },
    });
    expect(res.data).toEqual({ email: 'new@example.com', emailNotConfirmed: true, resent: true });
  });

  it('asks the user to wait when Supabase rate-limits the resend', async () => {
    setup({ resendError: { code: 'over_email_send_rate_limit' } });

    const res = await runAction({ ...credentials, intent: 'resend-confirmation' });

    expect(res.init?.status).toBe(400);
    expect(res.data).toEqual({
      email: 'new@example.com',
      emailNotConfirmed: true,
      error: 'Please wait a minute before requesting another link.',
    });
  });

  it('still rejects wrong credentials as before', async () => {
    const { resend } = setup({ signInError: { code: 'invalid_credentials' } });

    const res = await runAction(credentials);

    expect(resend).not.toHaveBeenCalled();
    expect(res.init?.status).toBe(400);
    expect(res.data).toEqual({ email: 'new@example.com', error: 'Invalid email or password.' });
  });
});
