import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_.organisation-application';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/profileTypesService.server');

const PROFILE_TYPES = [
  { id: 3, name: 'machine-builder', isSpace: true, order: 2 },
  { id: 2, name: 'workspace', isSpace: true, order: 1 },
  { id: 1, name: 'member', isSpace: false, order: 0 },
];

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

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getByAuthId: vi.fn().mockResolvedValue(opts.profile ?? null) };
  });

  (OrganisationApplicationsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return { existsByAuthId: vi.fn().mockResolvedValue(opts.hasApplication ?? true) };
    },
  );

  (ProfileTypesServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue(PROFILE_TYPES) };
  });
};

// biome-ignore lint/suspicious/noExplicitAny: minimal loader args stub
const args = () =>
  ({
    request: new Request('http://localhost/organisation-application'),
    params: {},
    context: {},
  }) as any;

describe('organisation application form gate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends anonymous visitors to the organisation sign-up', async () => {
    setup({ authed: false });

    const res = (await loader(args())) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/sign-up/organisation');
  });

  it('sends a signed-in account with no application back to sign-up', async () => {
    setup({ hasApplication: false });

    const res = (await loader(args())) as Response;

    expect(res.headers.get('location')).toBe('/sign-up/organisation');
  });

  it('sends an account that already has a profile to that profile', async () => {
    setup({ profile: { id: 7, username: 'the_shop' } });

    const res = (await loader(args())) as Response;

    expect(res.headers.get('location')).toBe('/u/the_shop');
  });

  it('sends a profile with no username to settings instead', async () => {
    setup({ profile: { id: 7, username: null } });

    const res = (await loader(args())) as Response;

    expect(res.headers.get('location')).toBe('/settings/profile');
  });

  it('shows the form to an applicant, offering only space types in order', async () => {
    setup({});

    const res = (await loader(args())) as { data: { profileTypes: { name: string }[] } };

    expect(res.data.profileTypes.map((t) => t.name)).toEqual(['workspace', 'machine-builder']);
  });
});
