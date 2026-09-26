import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.profile.type';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/profileTypesService.server');

const SPACE_TYPES = [
  { id: 2, name: 'workspace', isSpace: true },
  { id: 3, name: 'machine-builder', isSpace: true },
  { id: 1, name: 'member', isSpace: false },
];

const setup = (opts: {
  authed?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: profile stub
  profile?: any;
}) => {
  const getClaims = vi
    .fn()
    .mockResolvedValue(opts.authed === false ? { data: null } : { data: { claims: { sub: 'a1' } } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  const updateProfileType = vi.fn().mockResolvedValue({ id: 7, type: { name: 'machine-builder' } });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getByAuthId: vi
        .fn()
        .mockResolvedValue(
          opts.profile === undefined ? { id: 7, type: { is_space: true } } : opts.profile,
        ),
      updateProfileType,
    };
  });

  (ProfileTypesServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue(SPACE_TYPES) };
  });

  return { updateProfileType };
};

const req = (body: unknown) =>
  new Request('http://localhost/api/profile/type', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

// biome-ignore lint/suspicious/noExplicitAny: minimal action args stub
const args = (request: Request) => ({ request, params: {}, context: {} }) as any;

describe('change organisation focus', () => {
  beforeEach(() => vi.clearAllMocks());

  it('changes the focus to another space type', async () => {
    const { updateProfileType } = setup({});

    const res = (await action(args(req({ type: 3 })))) as Response;

    expect(res.status).toBe(200);
    expect(updateProfileType).toHaveBeenCalledWith(7, 3);
  });

  it('rejects anonymous callers', async () => {
    const { updateProfileType } = setup({ authed: false });

    const res = (await action(args(req({ type: 3 })))) as Response;

    expect(res.status).toBe(401);
    expect(updateProfileType).not.toHaveBeenCalled();
  });

  it('refuses a member profile, which has no focus to change', async () => {
    const { updateProfileType } = setup({ profile: { id: 7, type: { is_space: false } } });

    const res = (await action(args(req({ type: 3 })))) as Response;

    expect(res.status).toBe(403);
    expect(updateProfileType).not.toHaveBeenCalled();
  });

  it('refuses a switch to a non-space type', async () => {
    const { updateProfileType } = setup({});

    const res = (await action(args(req({ type: 1 })))) as Response;

    expect(res.status).toBe(400);
    expect(updateProfileType).not.toHaveBeenCalled();
  });

  it('refuses a type that does not exist', async () => {
    const { updateProfileType } = setup({});

    const res = (await action(args(req({ type: 999 })))) as Response;

    expect(res.status).toBe(400);
    expect(updateProfileType).not.toHaveBeenCalled();
  });

  it('requires a type', async () => {
    const { updateProfileType } = setup({});

    const res = (await action(args(req({})))) as Response;

    expect(res.status).toBe(400);
    expect(updateProfileType).not.toHaveBeenCalled();
  });

  it('errors when the caller has no profile', async () => {
    const { updateProfileType } = setup({ profile: null });

    const res = (await action(args(req({ type: 3 })))) as Response;

    expect(res.status).toBe(400);
    expect(updateProfileType).not.toHaveBeenCalled();
  });
});
