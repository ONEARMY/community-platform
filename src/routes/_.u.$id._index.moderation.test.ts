import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { LibraryServiceServer } from 'src/services/libraryService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { QuestionServiceServer } from 'src/services/questionService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_.u.$id._index';

vi.mock('src/repository/supabase.server');
vi.mock('src/factories/profileFactory.server');
vi.mock('src/services/libraryService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/questionService.server');
vi.mock('src/services/researchService.server');
vi.mock('src/services/tenantSettingsService.server');

const OWNER_AUTH_ID = 'owner-auth-1';

const setup = (opts: {
  // biome-ignore lint/suspicious/noExplicitAny: profile row stub or null
  profileDb?: any;
  // viewer's auth id, or undefined for a logged-out visitor
  viewerAuthId?: string;
  // roles on the viewer's own profile (resolved via getByAuthId)
  viewerRoles?: string[];
}) => {
  const getClaims = vi.fn().mockResolvedValue({
    data: { claims: opts.viewerAuthId ? { sub: opts.viewerAuthId } : null },
  });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue({ siteName: 'Test Site' }) };
  });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getByUsername: vi.fn().mockResolvedValue(opts.profileDb ?? null),
      getByAuthId: vi
        .fn()
        .mockResolvedValue(opts.viewerRoles ? { roles: opts.viewerRoles } : null),
      getAuthorUsefulVotes: vi.fn().mockResolvedValue(undefined),
      incrementViewCount: vi.fn(),
    };
  });

  (LibraryServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getUserProjects: vi.fn().mockResolvedValue([]) };
  });
  (ResearchServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getUserResearch: vi.fn().mockResolvedValue([]) };
  });
  (QuestionServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getQuestionsByUser: vi.fn().mockResolvedValue([]) };
  });

  (ProfileFactory as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { fromDB: vi.fn().mockReturnValue({ id: opts.profileDb?.id, displayName: 'A Profile' }) };
  });
};

// biome-ignore lint/suspicious/noExplicitAny: minimal LoaderFunctionArgs stub
const loaderArgs = () =>
  ({ request: new Request('http://localhost/u/an-org'), params: { id: 'an-org' } }) as any;

// The loader returns react-router's data() wrapper; unwrap its payload.
// biome-ignore lint/suspicious/noExplicitAny: data() wrapper shape
const payloadOf = (result: any) => result.data ?? result;

const pendingOrg = {
  id: 10,
  auth_id: OWNER_AUTH_ID,
  moderation: 'awaiting-moderation',
  total_views: 0,
};

describe('profile index loader — moderation visibility gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides a pending profile from a logged-out visitor', async () => {
    setup({ profileDb: pendingOrg, viewerAuthId: undefined });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).toBeNull();
  });

  it('hides a pending profile from a different logged-in user', async () => {
    setup({ profileDb: pendingOrg, viewerAuthId: 'someone-else' });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).toBeNull();
  });

  it('shows a pending profile to its owner', async () => {
    setup({ profileDb: pendingOrg, viewerAuthId: OWNER_AUTH_ID });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).not.toBeNull();
    expect(payloadOf(result).profile.id).toBe(pendingOrg.id);
  });

  it('shows a pending profile to an admin viewer', async () => {
    setup({ profileDb: pendingOrg, viewerAuthId: 'admin-1', viewerRoles: ['admin'] });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).not.toBeNull();
  });

  it('shows a pending profile to a moderator viewer', async () => {
    setup({ profileDb: pendingOrg, viewerAuthId: 'mod-1', viewerRoles: ['moderator'] });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).not.toBeNull();
  });

  it('shows an accepted profile to a logged-out visitor', async () => {
    setup({
      profileDb: { ...pendingOrg, moderation: 'accepted' },
      viewerAuthId: undefined,
    });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).not.toBeNull();
  });

  it('shows a profile with no moderation status (e.g. a member) to everyone', async () => {
    setup({
      profileDb: { ...pendingOrg, moderation: null },
      viewerAuthId: undefined,
    });

    const result = await loader(loaderArgs());

    expect(payloadOf(result).profile).not.toBeNull();
  });
});
