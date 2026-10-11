import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';

import { TenantSettingsService } from './tenantSettingsService.server';

vi.mock('src/config/config', () => ({ isProductionEnvironment: () => false }));

const clientWithSettings = (settings: Record<string, unknown>) =>
  ({
    from: (table: string) => ({
      select: () =>
        table === 'tenant_settings'
          ? { single: async () => ({ data: settings }) }
          : Promise.resolve({ count: 0, error: null }),
    }),
  }) as unknown as SupabaseClient;

describe('TenantSettingsService', () => {
  it('falls back to the same-origin logo when the tenant has no site image', async () => {
    const settings = await new TenantSettingsService(
      clientWithSettings({ site_image: null }),
    ).get();

    expect(settings.siteImage).toBe('/assets/img/one-army-logo.png');
  });

  it('uses the tenant site image when set', async () => {
    const settings = await new TenantSettingsService(
      clientWithSettings({ site_image: 'https://example.com/logo.png' }),
    ).get();

    expect(settings.siteImage).toBe('https://example.com/logo.png');
  });
});
