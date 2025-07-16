import Keyv from 'keyv'
import { isProductionEnvironment } from 'src/config/config'
import { MapPinFactory } from 'src/factories/mapPinFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { DBMapPin, MapPin } from 'oa-shared'

const cache = new Keyv<MapPin[]>({ ttl: 600000 }) // ttl: 10 minutes

// runs on the server
export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)
  const cachedMappins = await cache.get('mappins')

  // check if cached map pins are available and a producation environment, if not - load from db and cache them
  if (cachedMappins && isProductionEnvironment()) {
    return Response.json({ mapPins: cachedMappins }, { headers })
  }

  // get all profile tags

  const { data, error } = await client.from('map_pins').select(`
    id,
    profile_id,
    country,
    country_code,
    administrative,
    postcode,
    lat,
    lng,
    moderation,
    moderation_feedback,
    profile:profiles(
      id,
      display_name,
      username,
      is_verified,
      is_supporter,
      photo,
      tags:profile_tags_relations(
        profile_tags(
          id,
          name
        )
      )
    )
  `)

  if (!data || error) {
    console.error(error)

    return Response.json(
      {},
      { status: 500, statusText: 'Error fetching map-pins' },
    )
  }

  const pinsDb = data as unknown as DBMapPin[]
  const pinFactory = new MapPinFactory(client)
  const mapPins = pinsDb.map((x) => pinFactory.createMapPin(x))

  cache.set('mappins', mapPins)
  return Response.json({ mapPins }, { headers })
}

export const action = async ({ request }) => {
  const method = request.method
  switch (method) {
    case 'POST':
      // Create new map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return Response.json({ message: 'Created a map pin' })
    case 'PUT':
      // Edit existing map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return Response.json({ message: 'Updated a map pin' })
    case 'DELETE':
      // Delete a map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return Response.json({ message: 'Deleted a map pin' })
    default:
      return Response.json({ message: 'Method Not Allowed' }, { status: 405 })
  }
}
