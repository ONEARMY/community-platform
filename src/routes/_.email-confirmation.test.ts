import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action, loader } from './_.email-confirmation';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/organisationApplicationsService.server');

const setup = (opts: {
  // biome-ignore lint/suspicious/noExplicitAny: auth claims stub or null
  claims?: any;
  // biome-ignore lint/suspicious/noExplicitAny: verified user stub or null
  verifyUser?: any;
  // biome-ignore lint/suspicious/noExplicitAny: profile stub or null
  profile?: any;
  hasApplication?: boolean;
}) => {
  const getClaims = vi.fn().mockResolvedValue({ data: { claims: opts.claims ?? null } });
  const verifyOtp = vi.fn().mockResolvedValue({ data: { user: opts.verifyUser ?? null } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims, verifyOtp } },
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
};

// biome-ignore lint/suspicious/noExplicitAny: minimal args stubs
const loaderArgs = (url: string) => ({ request: new Request(url), params: {}, context: {} }) as any;
// biome-ignore lint/suspicious/noExplicitAny: minimal args stubs
const actionArgs = (url: string) =>
  ({ request: new Request(url, { method: 'POST' }), params: {}, context: {} }) as any;

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
