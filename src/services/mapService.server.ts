import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMapPin } from 'oa-shared'

const upsert = async (
  client: SupabaseClient,
  pin: Omit<DBMapPin, 'id' | 'profile'>,
) => {
  const existingPin = await client
    .from('map_pins')
    .select('id')
    .eq('user_id', pin.user_id)
  const existingPinId = existingPin.data?.at(0)?.id

  if (existingPinId) {
    const { data, error } = await client
      .from('map_pins')
      .update({
        name: pin.name,
        country: pin.country,
        country_code: pin.country_code,
        administrative: pin.administrative,
        postcode: pin.postcode,
        description: pin.description,
        lat: pin.lat,
        lng: pin.lng,
      })
      .eq('id', existingPinId)

    if (!data || error) {
      return { error }
    }
  } else {
    const { data, error } = await client.from('map_pins').insert({
      user_id: pin.user_id,
      name: pin.name,
      country: pin.country,
      country_code: pin.country_code,
      administrative: pin.administrative,
      postcode: pin.postcode,
      description: pin.description,
      lat: pin.lat,
      lng: pin.lng,
    })

    if (!data || error) {
      return { error }
    }
  }
}

export const mapServiceServer = {
  upsert,
}
