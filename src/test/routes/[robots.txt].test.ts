import { TenantSettings } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();

vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: vi.fn(() => ({ client: {} })),
}));

vi.mock('src/services/tenantSettingsService.server', () => ({
  TenantSettingsService: class {
    get = mockGet;
  },
}));

import { loader } from 'src/routes/[robots.txt]';

const createRequest = (host: string) =>
  new Request('https://example.com/robots.txt', {
    headers: { host },
  });

describe('[robots.txt] loader', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('disallows everything for fly.dev preview sites', async () => {
    const response = await loader({ request: createRequest('my-app.fly.dev') });
    const text = await response.text();

    expect(text).toContain('Disallow: /');
  });

  it('allows supported modules and disallows unsupported ones', async () => {
    mockGet.mockResolvedValue(
      new TenantSettings({
        supportedModules: 'library,map,research',
      }),
    );

    const response = await loader({ request: createRequest('community.example.com') });
    const text = await response.text();

    expect(text).toContain('Allow: /library/');
    expect(text).toContain('Allow: /map/');
    expect(text).toContain('Allow: /research/');
    expect(text).toContain('Disallow: /academy/');
    expect(text).toContain('Disallow: /questions/');
    expect(text).toContain('Disallow: /news/');
  });

  it('disallows hidden modules even if they are supported', async () => {
    mockGet.mockResolvedValue(
      new TenantSettings({
        supportedModules: 'library,map,research,academy,questions,news',
        hiddenModules: 'academy, questions',
      }),
    );

    const response = await loader({ request: createRequest('community.example.com') });
    const text = await response.text();

    expect(text).toContain('Allow: /library/');
    expect(text).toContain('Allow: /map/');
    expect(text).toContain('Allow: /research/');
    expect(text).toContain('Allow: /news/');
    expect(text).toContain('Disallow: /academy/');
    expect(text).toContain('Disallow: /questions/');
  });

  it('allows all supported modules when hiddenModules is undefined', async () => {
    mockGet.mockResolvedValue(
      new TenantSettings({
        supportedModules: 'library,map',
      }),
    );

    const response = await loader({ request: createRequest('community.example.com') });
    const text = await response.text();

    expect(text).toContain('Allow: /library/');
    expect(text).toContain('Allow: /map/');
    expect(text).toContain('Disallow: /research/');
    expect(text).toContain('Disallow: /academy/');
    expect(text).toContain('Disallow: /questions/');
    expect(text).toContain('Disallow: /news/');
  });

  it('returns text/plain content type', async () => {
    mockGet.mockResolvedValue(new TenantSettings({ supportedModules: 'library' }));

    const response = await loader({ request: createRequest('community.example.com') });

    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });
});
