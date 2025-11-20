import Keyv from 'keyv';
import { ProfileType } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

import type { SupabaseClient } from '@supabase/supabase-js';

const cache = new Keyv<ProfileType[]>({ ttl: 3600000 }); // ttl: 60 minutes

export class ProfileTypesServiceServer {
  constructor(private client: SupabaseClient) {}

  async get(cached = true) {
    if (cached) {
      const cachedProfileTypes = await cache.get('profile-types');

      if (
        cachedProfileTypes &&
        Array.isArray(cachedProfileTypes) &&
        cachedProfileTypes.length &&
        isProductionEnvironment()
      ) {
        return cachedProfileTypes;
      }
    }

    const profileTypesResult = await this.client.from('profile_types').select(`
      id,
      name,
      display_name,
      order,
      image_url,
      small_image_url,
      description,
      map_pin_name,
      is_space
      `);

    const dbProfileTypes = profileTypesResult.data || [];
    const profileTypes = dbProfileTypes.map((x) => ProfileType.fromDB(x));

    await cache.set('profile-types', profileTypes);

    return profileTypes;
  }
}
