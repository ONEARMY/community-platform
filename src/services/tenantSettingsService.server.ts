import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import { TenantSettings } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

const cache = new Keyv<TenantSettings>({ ttl: 3600000 }); // ttl: 60 minutes

export class TenantSettingsService {
  constructor(private client: SupabaseClient) {}

  async get(cacheBypass = false): Promise<TenantSettings> {
    if (!cacheBypass) {
      const cachedTenantSettings = await cache.get('tenant-settings');

      if (cachedTenantSettings && isProductionEnvironment()) {
        return cachedTenantSettings;
      }
    }

    const { data } = await this.client
      .from('tenant_settings')
      .select(
        `site_name,
        site_url,
        message_sign_off,
        email_from,
        site_image,
        no_messaging,
        library_heading,
        academy_resource,
        profile_guidelines,
        questions_guidelines,
        supported_modules,
        patreon_id`,
      )
      .single();

    const settings = new TenantSettings({
      siteName: data?.site_name || 'The Community Platform',
      siteUrl: data?.site_url || 'https://community.preciousplastic.com',
      messageSignOff: data?.message_sign_off || 'One Army',
      emailFrom: data?.email_from || 'hello@onearmy.earth',
      siteImage: data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
      noMessaging: data?.no_messaging || false,
      academyResource: data?.academy_resource,
      libraryHeading: data?.library_heading,
      patreonId: data?.patreon_id,
      profileGuidelines: data?.profile_guidelines,
      questionsGuidelines: data?.questions_guidelines,
      supportedModules: data?.supported_modules,
    });

    cache.set('tenant-settings', settings);

    return settings;
  }
}
