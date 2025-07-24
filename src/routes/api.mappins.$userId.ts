import { MapPinFactory } from 'src/factories/mapPinFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { DBMapPin } from 'oa-shared'

// runs on the server
export const loader = async ({ request, params }) => {
  const { client, headers } = createSupabaseServerClient(request)
  const profileId = Number(params.userId)

  const { data, error } = await client
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
      moderation_feedback,
      profile:profiles(
        id,
        type,
        display_name,
        username,
        is_verified,
        is_supporter,
        photo
      )
    `,
    )
    .eq('profile_id', profileId)

  if (error) {
    console.error(error)

    return Response.json(
      {},
      { status: 500, statusText: 'Error fetching map-pins', headers },
    )
  }

  if (!data?.length) {
    return Response.json({ mapPin: null }, { headers })
  }

  const pinsDb = data[0] as unknown as DBMapPin
  const pinFactory = new MapPinFactory(client)
  const mapPin = pinFactory.fromDBWithProfile(pinsDb)

  return Response.json({ mapPin }, { headers })
}
