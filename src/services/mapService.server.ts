import type { SupabaseClient } from '@supabase/supabase-js';
import type { Moderation, Profile, UpsertPin } from 'oa-shared';

export class MapServiceServer {
  constructor(private client: SupabaseClient) {}

  async upsert(pin: UpsertPin, profile: Profile) {
    const existingPin = await this.client
      .from('map_pins')
      .select('id,moderation')
      .eq('profile_id', pin.profile_id);
    const existingPinId = existingPin.data?.at(0)?.id;

    if (existingPinId) {
      const moderation: Moderation =
        existingPin.data![0].moderation === 'accepted' ? 'accepted' : 'awaiting-moderation';

      return await this.client
        .from('map_pins')
        .update({
          country: pin.country,
          country_code: pin.country_code,
          name: pin.name,
          administrative: pin.administrative,
          post_code: pin.post_code,
          moderation,
          lat: pin.lat,
          lng: pin.lng,
        })
        .eq('id', existingPinId)
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
            type,
            username
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
          )`,
        )
        .single();
    } else {
      const moderation: Moderation =
        profile.type?.name === 'member' ? 'accepted' : 'awaiting-moderation';

      return await this.client
        .from('map_pins')
        .insert({
          profile_id: pin.profile_id,
          country: pin.country,
          country_code: pin.country_code,
          name: pin.name,
          administrative: pin.administrative,
          post_code: pin.post_code,
          lat: pin.lat,
          lng: pin.lng,
          moderation,
          tenant_id: process.env.TENANT_ID,
        })
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
            type,
            display_name,
            username,
            photo,
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
          )`,
        )
        .single();
    }
  }
}
