import { json } from '@remix-run/node'
import { ProfileFactory } from 'src/factories/profileFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { UsefulVoter } from 'shared/models/profile'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const { contentType, contentId } = params
  const profileFactory = new ProfileFactory(client)

  if (!contentType || !contentId) {
    return json({ error: 'Missing parameters' }, { status: 400 })
  }

  const { data, error } = await client
    .from('useful_votes')
    .select(
      `profiles(id, username, display_name, photo, country, type:profile_types(
            id,
            name,
            display_name,
            image_url,
            small_image_url,
            map_pin_name,
            description,
            is_space
          ), badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
    )))`,
    )
    .eq('content_type', contentType)
    .eq('content_id', Number(contentId))
    .eq('tenant_id', process.env.TENANT_ID!)

  if (error) {
    console.error(error)
    return json({ error: error.message }, { status: 500 })
  }

  // Transform the data using ProfileFactory and pick required properties
  const users: UsefulVoter[] = data.map((row) => {
    const profile = profileFactory.fromDB(row.profiles)
    console.log('profile:', profile)
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      photo: profile.photo,
      country: profile.country,
      badges: profile.badges,
      type: profile.type,
    }
  })

  return json(users, { headers })
}
