import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import { OrganisationSignupSettings } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

const cache = new Keyv<OrganisationSignupSettings | null>({ ttl: 3600000 }); // ttl: 60 minutes

export class OrganisationSignupSettingsServiceServer {
  constructor(private client: SupabaseClient) {}

  async get(): Promise<OrganisationSignupSettings | null> {
    if (isProductionEnvironment()) {
      const cached = await cache.get('organisation-signup-settings');

      if (cached !== undefined) {
        return cached;
      }
    }

    const result = await this.client
      .from('organisation_signup_settings')
      .select('id, description, image_url')
      .maybeSingle();

    const settings = result.data ? OrganisationSignupSettings.fromDB(result.data) : null;

    await cache.set('organisation-signup-settings', settings);

    return settings;
  }
}
