import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_.settings.$';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/redirectService.server', () => ({
  redirectServiceServer: { redirectSignIn: vi.fn().mockReturnValue(new Response(null)) },
}));
vi.mock('src/services/tenantSettingsService.server');

const setup = (opts: {
  authed?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: profile stub
  profile?: any;
  hasApplication?: boolean;
}) => {
  const getClaims = vi
    .fn()
    .mockResolvedValue(opts.authed === false ? { data: null } : { data: { claims: { sub: 'a1' } } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  const profile = 'profile' in opts ? opts.profile : { id: 7 };

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getByAuthId: vi.fn().mockResolvedValue(profile) };
  });

  (OrganisationApplicationsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return { existsByAuthId: vi.fn().mockResolvedValue(opts.hasApplication ?? false) };
    },
  );

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue({ siteName: 'Test Site' }) };
  });
};

// biome-ignore lint/suspicious/noExplicitAny: minimal loader args stub
const args = (path = '/settings/profile') =>
  ({ request: new Request(`http://localhost${path}`), params: {}, context: {} }) as any;

describe('settings gate for organisation applicants', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends an unfinished applicant to the application form', async () => {
    setup({ profile: null, hasApplication: true });

    const res = (await loader(args())) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/organisation-application');
  });

  it('sends signed-out visitors to sign-in', async () => {
    setup({ authed: false });

    await loader(args());

    expect(redirectServiceServer.redirectSignIn).toHaveBeenCalled();
  });

  it('lets a member through to their settings', async () => {
    setup({ profile: { id: 7 } });

    const res = await loader(args());

    expect((res as Response)?.headers?.get?.('location')).not.toBe('/organisation-application');
  });

  it('redirects a bare /settings to the profile tab', async () => {
    setup({ profile: { id: 7 } });

    const res = (await loader(args('/settings'))) as Response;

    expect(res.headers.get('location')).toBe('/settings/profile');
  });
});
