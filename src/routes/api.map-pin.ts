import { MapPinFactory } from 'src/factories/mapPinFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { DBMapPin } from 'oa-shared'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)
  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) {
      return Response.json({}, { headers, status: 401 })
    }

    const profileService = new ProfileServiceServer(client)
    const profile = await profileService.getByAuthId(user!.id)

    if (!profile) {
      return Response.json({}, { status: 400, statusText: 'user not found' })
    }

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
        )
      `,
      )
      .eq('profile_id', profile.id)

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
  } catch (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }
}
