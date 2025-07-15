import { Profile } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { ExternalLinkLabel, IExternalLink } from 'oa-shared'

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
    .select('*')
    .single()

  const profile = Profile.fromDB(data)

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
    type: formData.get('type') === 'true',
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
    links: [] as IExternalLink[],
  }

  for (let i = 0; i < data.linkCount; i++) {
    data.links.push({
      label: formData.get(`links.[${i}].label`) as ExternalLinkLabel,
      url: formData.get(`links.[${i}].url`) as string,
    })
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.updateProfile(data)

  return Response.json({ profile }, { headers, status: 200 })
}
