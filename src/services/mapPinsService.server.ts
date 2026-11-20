import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import type { Database, DBMapPin, MapPin } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';
import { MapPinFactory } from 'src/factories/mapPinFactory.server';

const cache = new Keyv<MapPin[]>({ ttl: 3600000 }); // ttl: 60 minutes
const PAGE_SIZE = 1000;

export class MapPinsServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async get() {
    const cachedMappins = await cache.get('mappins');

    // check if cached map pins are available and a producation environment, if not - load from db and cache them
    if (
      cachedMappins &&
      Array.isArray(cachedMappins) &&
      cachedMappins.length > 0 &&
      isProductionEnvironment()
    ) {
      return cachedMappins;
    }

    const pinsDb: DBMapPin[] = [];

    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await this.client
        .from('map_pins')
        .select(
          `
        id,
        profile_id,
        country,
        country_code,
        name,
        administrative,
        post_code,
        lat,
        lng,
        moderation,
        profile:profiles(
          id,
          country,
          display_name,
          photo,
          cover_images,
          about,
          username,
          last_active,
          badges:profile_badges_relations(
            profile_badges(
              id,
              name,
              display_name,
              image_url,
              action_url
            )
          ),
          tags:profile_tags_relations(
            profile_tags(
              id,
              name
            )
          ),
          type:profile_types(
            id,
            name,
            display_name,
            image_url,
            small_image_url,
            map_pin_name,
            description,
            is_space
          )
        )
      `,
        )
        .eq('moderation', 'accepted')
        .order('id')
        .range(from, from + PAGE_SIZE - 1);

      if (!data || error) {
        throw error;
      }

      pinsDb.push(...(data as unknown as DBMapPin[]));

      if (data.length < PAGE_SIZE) {
        break;
      }
    }

    const pinFactory = new MapPinFactory(this.client);
    const mapPins = pinsDb
      .filter((pin) => pin.profile)
      .map((pin) => pinFactory.fromDBWithProfile(pin));

    cache.set('mappins', mapPins);

    return mapPins;
  }

  async getByProfileType(profileType: string) {
    const allPins = await this.get();

    if (!profileType) {
      return allPins;
    }

    return allPins.filter((pin) => pin.profile?.type?.name === profileType);
  }

  async delete(profileId: number) {
    const { error } = await this.client.from('map_pins').delete().eq('profile_id', profileId);

    if (error) {
      throw error;
    }

    cache.delete('mappins');
  }

  clearCache() {
    cache.delete('mappins');
  }
}
