import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './_.sign-in';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/profileService.server');

const setup = (opts: { hasApplication?: boolean }) => {
  const signInWithPassword = vi
    .fn()
    .mockResolvedValue({ data: { user: { id: 'auth-1' } }, error: null });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { signInWithPassword } },
    headers: new Headers(),
  });

  const ensureProfile = vi.fn().mockResolvedValue(undefined);

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      ensureProfile,
      getByAuthId: vi.fn().mockResolvedValue({ id: 7, username: 'someone' }),
      updateUserActivity: vi.fn(),
    };
  });

  (OrganisationApplicationsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return { existsByAuthId: vi.fn().mockResolvedValue(opts.hasApplication ?? false) };
    },
  );

  return { ensureProfile };
};

const req = () =>
  new Request('http://localhost/sign-in', {
    method: 'POST',
    body: new URLSearchParams({ email: 'org@example.com', password: 'hunter2hunter2' }),
  });

// biome-ignore lint/suspicious/noExplicitAny: minimal action args stub
const args = (request: Request) => ({ request, params: {}, context: {} }) as any;

describe('signing in as an unfinished organisation applicant', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the applicant to their application form', async () => {
    setup({ hasApplication: true });

    const res = (await action(args(req()))) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/organisation-application');
  });

  it('does not create a member profile for them', async () => {
    const { ensureProfile } = setup({ hasApplication: true });

    await action(args(req()));

    expect(ensureProfile).not.toHaveBeenCalled();
  });

  it('signs an ordinary member in as usual', async () => {
    const { ensureProfile } = setup({ hasApplication: false });

    const res = (await action(args(req()))) as Response;

    expect(ensureProfile).toHaveBeenCalled();
    expect(res.headers.get('location')).toBe('/u/someone');
  });
});
