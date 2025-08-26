import Keyv from 'keyv'
import { isProductionEnvironment } from 'src/config/config'
import { MapPinFactory } from 'src/factories/mapPinFactory.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMapPin, MapPin } from 'oa-shared'

const cache = new Keyv<MapPin[]>({ ttl: 3600000 }) // ttl: 60 minutes

export class MapPinsServiceServer {
  constructor(private client: SupabaseClient) {}

  async get() {
    const cachedMappins = await cache.get('mappins')

    // check if cached map pins are available and a producation environment, if not - load from db and cache them
    if (cachedMappins && isProductionEnvironment()) {
      return cachedMappins
    }

    // get all profile tags
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
          type,
          about,
          username,
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

    if (!data || error) {
      throw error
    }

    const pinsDb = data as unknown as DBMapPin[]
    const pinFactory = new MapPinFactory(this.client)
    const mapPins = pinsDb
      .filter((pin) => pin.profile)
      .map((pin) => pinFactory.fromDBWithProfile(pin))

    cache.set('mappins', mapPins)

    return mapPins
  }

  async delete(profileId: number) {
    const { error } = await this.client
      .from('map_pins')
      .delete()
      .eq('profile_id', profileId)

    if (error) {
      throw error
    }

    cache.delete('mappins')
  }

  clearCache() {
    cache.delete('mappins')
  }
}
