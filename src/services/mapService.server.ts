import type { SupabaseClient } from '@supabase/supabase-js'
import type { UpsertPin } from 'oa-shared'

export class MapServiceServer {
  constructor(private client: SupabaseClient) {}

  async upsert(pin: UpsertPin) {
    const existingPin = await this.client
      .from('map_pins')
      .select('id')
      .eq('profile_id', pin.profile_id)
    const existingPinId = existingPin.data?.at(0)?.id

    if (existingPinId) {
      const { data, error } = await this.client
        .from('map_pins')
        .update({
          country: pin.country,
          country_code: pin.country_code,
          administrative: pin.administrative,
          post_code: pin.post_code,
          lat: pin.lat,
          lng: pin.lng,
        })
        .eq('id', existingPinId)

      if (!data || error) {
        return { error }
      }
    } else {
      const { data, error } = await this.client.from('map_pins').insert({
        profile_id: pin.profile_id,
        country: pin.country,
        country_code: pin.country_code,
        administrative: pin.administrative,
        post_code: pin.post_code,
        lat: pin.lat,
        lng: pin.lng,
      })

      if (!data || error) {
        return { error }
      }
    }
  }
}
