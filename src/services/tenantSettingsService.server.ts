import type { SupabaseClient } from '@supabase/supabase-js';
import { TenantSettings } from 'oa-shared';

export class TenantSettingsService {
  constructor(private client: SupabaseClient) {}

  async get(): Promise<TenantSettings> {
    const { data } = await this.client
      .from('tenant_settings')
      .select('site_name,site_url,message_sign_off,email_from,site_image')
      .single();

    return new TenantSettings({
      siteName: data?.site_name || 'The Community Platform',
      siteUrl: data?.site_url || 'https://community.preciousplastic.com',
      messageSignOff: data?.message_sign_off || 'One Army',
      emailFrom: data?.email_from || 'hello@onearmy.earth',
      siteImage:
        data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
    });
  }
}
