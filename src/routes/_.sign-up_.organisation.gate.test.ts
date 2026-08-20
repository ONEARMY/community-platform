import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_.sign-up_.organisation';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileTypesService.server');
vi.mock('src/services/tenantSettingsService.server');

// biome-ignore lint/suspicious/noExplicitAny: minimal LoaderFunctionArgs stub
const loaderArgs = () =>
  ({ request: new Request('http://localhost/sign-up/organisation'), params: {}, context: {} }) as any;

const setup = (opts: { description?: string; hasSpaceType: boolean; authed?: boolean }) => {
  const getClaims = vi
    .fn()
    .mockResolvedValue({ data: { claims: opts.authed ? { sub: 'auth-1' } : null } });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      get: vi.fn().mockResolvedValue({
        siteName: 'Test Site',
        organisationSignupDescriptionHtml: opts.description,
      }),
    };
  });

  (ProfileTypesServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      get: vi
        .fn()
        .mockResolvedValue(
          opts.hasSpaceType
            ? [{ name: 'workspace', isSpace: true }]
            : [{ name: 'member', isSpace: false }],
        ),
    };
  });
};

describe('organisation sign-up loader — enable/disable gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /sign-up when no organisation_signup_description is configured', async () => {
    setup({ description: undefined, hasSpaceType: true });

    const res = (await loader(loaderArgs())) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/sign-up');
  });

  it('redirects to /sign-up when there is no space profile type', async () => {
    setup({ description: '<p>Apply as an organisation</p>', hasSpaceType: false });

    const res = (await loader(loaderArgs())) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/sign-up');
  });

  it('redirects an already-authenticated user to /', async () => {
    setup({ description: '<p>Apply as an organisation</p>', hasSpaceType: true, authed: true });

    const res = (await loader(loaderArgs())) as Response;

    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/');
  });

  it('renders the page when a description + space type are configured', async () => {
    setup({ description: '<p>Apply as an organisation</p>', hasSpaceType: true });

    const res = await loader(loaderArgs());

    // data() is not a redirect Response — it should not be a 302
    expect((res as { status?: number }).status).not.toBe(302);
  });
});
