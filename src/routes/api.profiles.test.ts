import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './api.profiles';

vi.mock('src/repository/supabase.server');
vi.mock('src/factories/profileFactory.server', () => ({
  ProfileFactory: vi.fn().mockImplementation(function () {
    return { fromDB: (x: unknown) => x };
  }),
}));

const setup = (opts: { authed?: boolean } = {}) => {
  const limit = vi.fn().mockResolvedValue({ data: [] });
  const or = vi.fn();
  const select = vi.fn();
  const from = vi.fn();

  // .or() is chained twice before .limit()
  or.mockImplementation(() => ({ or, limit }));
  select.mockImplementation(() => ({ or, limit }));
  from.mockImplementation(() => ({ select }));

  const getClaims = vi
    .fn()
    .mockResolvedValue(opts.authed === false ? { data: null } : { data: { claims: { sub: 'a1' } } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims }, from },
    headers: new Headers(),
  });

  return { or, from };
};

// biome-ignore lint/suspicious/noExplicitAny: minimal loader args stub
const args = (url: string) => ({ request: new Request(url), params: {}, context: {} }) as any;

describe('profile search', () => {
  beforeEach(() => vi.clearAllMocks());

  it('excludes profiles that are not through moderation yet', async () => {
    const { or } = setup();

    await loader(args('http://localhost/api/profiles?q=shop'));

    expect(or).toHaveBeenCalledWith('moderation.is.null,moderation.eq.accepted');
  });

  it('still matches on username and display name', async () => {
    const { or } = setup();

    await loader(args('http://localhost/api/profiles?q=shop'));

    expect(or).toHaveBeenCalledWith('username.ilike.%shop%,display_name.ilike.%shop%');
  });

  it('rejects anonymous callers', async () => {
    const { from } = setup({ authed: false });

    const res = (await loader(args('http://localhost/api/profiles?q=shop'))) as Response;

    expect(res.status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });

  it('requires a query', async () => {
    setup();

    const res = (await loader(args('http://localhost/api/profiles'))) as Response;

    expect(res.status).toBe(400);
  });
});
