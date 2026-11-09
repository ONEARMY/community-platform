import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Moderation, Profile, UpsertPin } from 'oa-shared';

export class MapServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  private pinModeration(profile: Profile): Moderation {
    if (!profile.type?.isSpace) {
      return 'accepted';
    }

    return profile.moderation ?? 'awaiting-moderation';
  }

  async upsert(pin: UpsertPin, profile: Profile) {
    const existingPin = await this.client
      .from('map_pins')
      .select('id')
      .eq('profile_id', pin.profile_id);
    const existingPinId = existingPin.data?.at(0)?.id;

    if (existingPinId) {
      const moderation = this.pinModeration(profile);

      return await this.client
        .from('map_pins')
        .update({
          country: pin.country,
          country_code: pin.country_code,
          name: pin.name,
          administrative: pin.administrative,
          post_code: pin.post_code,
          moderation,
          lat: String(pin.lat),
          lng: String(pin.lng),
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
          )`,
        )
        .single();
    } else {
      const moderation = this.pinModeration(profile);

      return await this.client
        .from('map_pins')
        .insert({
          profile_id: pin.profile_id,
          country: pin.country,
          country_code: pin.country_code,
          name: pin.name,
          administrative: pin.administrative,
          post_code: pin.post_code,
          lat: String(pin.lat),
          lng: String(pin.lng),
          moderation,
          tenant_id: process.env.TENANT_ID!,
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

  async updateModerationByProfileId(
    profileId: number,
    moderation: Moderation,
    feedback: string | null,
  ) {
    const { error } = await this.client
      .from('map_pins')
      .update({ moderation, moderation_feedback: feedback })
      .eq('profile_id', profileId);

    if (error) {
      throw error;
    }
  }
}
