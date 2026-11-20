import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader } from './_index';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/tenantSettingsService.server');

const setup = (settings: { supportedModules?: string; hiddenModules?: string }) => {
  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {},
    headers: new Headers(),
  });

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue(settings) };
  });
};

const homepageFor = async (settings: { supportedModules?: string; hiddenModules?: string }) => {
  setup(settings);
  const response = (await loader({ request: new Request('http://localhost/') } as never)) as Response;
  return response.headers.get('Location');
};

describe('homepage loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to news when news is a public module', async () => {
    expect(await homepageFor({ supportedModules: 'academy,news', hiddenModules: '' })).toBe('/news');
  });

  it('redirects to academy when news is not supported', async () => {
    expect(await homepageFor({ supportedModules: 'academy,map', hiddenModules: '' })).toBe('/academy');
  });

  it('redirects to academy when news is hidden', async () => {
    expect(await homepageFor({ supportedModules: 'academy,news', hiddenModules: 'news' })).toBe(
      '/academy',
    );
  });
});
