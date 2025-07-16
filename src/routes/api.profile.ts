import { ProfileFactory } from 'src/factories/profileFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const nowUtc = new Date().toISOString()

  const { data } = await client
    .from('profiles')
    .update({ last_active: nowUtc })
    .eq('auth_id', user.id)
    .select(
      `*,
      tags:profile_tags_relations(
        profile_tags(
          id,
          name
        )
      )`,
    )
    .single()

  const profileFactory = new ProfileFactory(client)
  const profile = profileFactory.createProfile(data)

  return Response.json(profile, { headers, status: 200 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const formData = await request.formData()
  const data = {
    displayName: formData.get('displayName') as string,
    about: formData.get('about') as string,
    country: formData.get('country') as string,
    type: formData.get('type'),
    existingImageId: formData.get('existingImageId') as string,
    isContactable: formData.get('isContactable') === 'true',
    showVisitorPolicy: formData.get('showVisitorPolicy') === 'true',
    visitorPolicyDetails: formData.get('visitorPolicyDetails') as string,
    visitorPolicy: formData.get('visitorPolicy') as string,
    linkCount: parseInt(formData.get('linkCount') as string),
    existingCoverImageIds: formData.has('existingCoverImageIds')
      ? formData.getAll('existingCoverImageIds')
      : null,
    tags: formData.has('tags')
      ? formData.getAll('tags').map((x) => Number(x))
      : null,
    link: formData.get('link'),
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.updateProfile(data)

  return Response.json({ profile }, { headers, status: 200 })
}
