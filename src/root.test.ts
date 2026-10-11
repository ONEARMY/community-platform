import { describe, expect, it, vi } from 'vitest';

import { meta } from './root';

vi.mock('./repository/supabase.server', () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock('./services/tenantSettingsService.server', () => ({ TenantSettingsService: vi.fn() }));

describe('root meta', () => {
  it('includes the standard and Apple web app capable tags', () => {
    const tags = meta({ loaderData: { siteName: 'Test Site' } } as Parameters<typeof meta>[0]);

    expect(tags).toContainEqual({ name: 'mobile-web-app-capable', content: 'yes' });
    expect(tags).toContainEqual({ name: 'apple-mobile-web-app-capable', content: 'yes' });
  });
});
