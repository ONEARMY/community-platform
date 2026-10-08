import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_.news.$slug._index';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/newsService.server');
vi.mock('src/services/tenantSettingsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/factories/profileFactory.server');
vi.mock('src/services/contentService.server');
vi.mock('src/services/redirectService.server');
vi.mock('src/utils/renderNewsBodyHtml', () => ({ renderNewsBodyHtml: () => '' }));
vi.mock('src/pages/News/NewsPage', () => ({ NewsPage: () => null }));
vi.mock('src/pages/NotFound/NotFound', () => ({ NotFoundPage: () => null }));

const dbNews = (badgeIds: number[]) => ({
  id: 11,
  slug: 'members-only',
  title: 'Members only',
  created_at: '2026-01-01T00:00:00.000Z',
  total_views: 0,
  tags: [],
  hero_image: null,
  poll: null,
  content: null,
  profile_badges: badgeIds.map((id) => ({ profile_badges: { id, name: `badge-${id}` } })),
});

const setup = (opts: {
  badgeIds?: number[];
  authed?: boolean;
  roles?: string[];
  access?: { is_readable: boolean; cta_badge_id: number | null } | null;
}) => {
  const getClaims = vi
    .fn()
    .mockResolvedValue(opts.authed ? { data: { claims: { sub: 'a1' } } } : { data: null });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  const getAccess = vi.fn().mockResolvedValue(opts.access ?? null);

  (NewsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getBySlug: vi.fn().mockResolvedValue({ data: dbNews(opts.badgeIds ?? []), error: null }),
      getAccess,
      getHeroImage: vi.fn().mockResolvedValue(null),
    };
  });

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue({ siteName: 'Test' }) };
  });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getByAuthId: vi.fn().mockResolvedValue({ id: 7 }) };
  });

  (ProfileFactory as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { fromDB: vi.fn().mockReturnValue({ id: 7, roles: opts.roles ?? [] }) };
  });

  (ContentServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      incrementViewCount: vi.fn(),
      getMetaFields: vi.fn().mockResolvedValue([{ count: 0 }, { count: 0 }, []]),
    };
  });

  const signInRedirect = new Response(null, { status: 302 });
  vi.mocked(redirectServiceServer.redirectSignIn).mockReturnValue(signInRedirect);

  return { getAccess, signInRedirect };
};

const args = {
  request: new Request('http://localhost/news/members-only'),
  params: { slug: 'members-only' },
  context: {},
} as any;

const loadedNews = (result: any) => result?.data?.news;

describe('news page loader', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads unrestricted news without checking access', async () => {
    const { getAccess } = setup({});

    const result = await loader(args);

    expect(loadedNews(result)?.id).toBe(11);
    expect(getAccess).not.toHaveBeenCalled();
  });

  it('sends anonymous visitors of restricted news to sign in', async () => {
    const { getAccess, signInRedirect } = setup({ badgeIds: [3] });

    const result = await loader(args);

    expect(result).toBe(signInRedirect);
    expect(redirectServiceServer.redirectSignIn).toHaveBeenCalledWith(
      '/news/members-only',
      expect.any(Headers),
    );
    expect(getAccess).not.toHaveBeenCalled();
  });

  it('loads restricted news the viewer can read', async () => {
    const { getAccess } = setup({
      badgeIds: [3],
      authed: true,
      access: { is_readable: true, cta_badge_id: null },
    });

    const result = await loader(args);

    expect(loadedNews(result)?.id).toBe(11);
    expect(getAccess).toHaveBeenCalledWith(11, 7, false);
  });

  it('passes staff roles to the access check', async () => {
    const { getAccess } = setup({
      badgeIds: [3],
      authed: true,
      roles: ['editor'],
      access: { is_readable: true, cta_badge_id: null },
    });

    await loader(args);

    expect(getAccess).toHaveBeenCalledWith(11, 7, true);
  });

  it('redirects to the news list when the viewer cannot read it', async () => {
    setup({ badgeIds: [3], authed: true, access: { is_readable: false, cta_badge_id: 3 } });

    const result = (await loader(args)) as Response;

    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/news');
  });

  it('fails closed when the access check returns nothing', async () => {
    setup({ badgeIds: [3], authed: true, access: null });

    const result = (await loader(args)) as Response;

    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/news');
  });
});
