import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.profile';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileService.server');
vi.mock('src/factories/profileFactory.server');

const PHOTO = { id: 'p1', path: 'p1.jpg' };
const COVER = { id: 'c1', path: 'c1.jpg' };

const setup = (opts: {
  // biome-ignore lint/suspicious/noExplicitAny: profile stub
  profile?: any;
}) => {
  const getClaims = vi.fn().mockResolvedValue({ data: { claims: { sub: 'a1' } } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  const updateProfile = vi.fn().mockResolvedValue({ id: 7 });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getByAuthId: vi.fn().mockResolvedValue(opts.profile),
      updateProfile,
      updateUserActivity: vi.fn(),
    };
  });

  (ProfileFactory as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { fromDB: (x: unknown) => x };
  });

  return { updateProfile };
};

const req = (fields: Record<string, string> = {}) => {
  const body = new URLSearchParams({
    displayName: 'The Machine Shop',
    about: 'We build machines.',
    website: 'https://example.org',
    isContactable: 'true',
    showVisitorPolicy: 'false',
    photo: JSON.stringify(PHOTO),
    ...fields,
  });
  body.append('coverImages', JSON.stringify(COVER));
  return new Request('http://localhost/api/profile', { method: 'POST', body });
};

// biome-ignore lint/suspicious/noExplicitAny: minimal action args stub
const args = (request: Request) => ({ request, params: {}, context: {} }) as any;

const org = (moderation: string | null) => ({
  id: 7,
  type: { is_space: true },
  moderation,
});

describe('saving a profile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resubmits an organisation that was asked for changes', async () => {
    const { updateProfile } = setup({ profile: org('improvements-needed') });

    await action(args(req()));

    expect(updateProfile).toHaveBeenCalledWith(7, expect.anything(), true);
  });

  it('does not resubmit while the application is still awaiting review', async () => {
    const { updateProfile } = setup({ profile: org('awaiting-moderation') });

    await action(args(req()));

    expect(updateProfile).toHaveBeenCalledWith(7, expect.anything(), false);
  });

  it('does not resubmit an approved organisation', async () => {
    const { updateProfile } = setup({ profile: org('accepted') });

    await action(args(req()));

    expect(updateProfile).toHaveBeenCalledWith(7, expect.anything(), false);
  });

  it('never resubmits a member profile', async () => {
    const { updateProfile } = setup({
      profile: { id: 7, type: { is_space: false }, moderation: 'improvements-needed' },
    });

    await action(args(req()));

    expect(updateProfile).toHaveBeenCalledWith(7, expect.anything(), false);
  });

  it('requires an organisation to have a photo', async () => {
    const { updateProfile } = setup({ profile: org('accepted') });

    const body = new URLSearchParams({
      displayName: 'The Machine Shop',
      about: 'We build machines.',
      website: 'https://example.org',
    });
    body.append('coverImages', JSON.stringify(COVER));

    const res = (await action(
      args(new Request('http://localhost/api/profile', { method: 'POST', body })),
    )) as Response;

    expect(res.status).toBe(400);
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('does not require a photo from a member', async () => {
    const { updateProfile } = setup({
      profile: { id: 7, type: { is_space: false }, moderation: null },
    });

    const body = new URLSearchParams({
      displayName: 'Some Member',
      about: 'Hello.',
      website: '',
    });

    await action(args(new Request('http://localhost/api/profile', { method: 'POST', body })));

    expect(updateProfile).toHaveBeenCalled();
  });
});
