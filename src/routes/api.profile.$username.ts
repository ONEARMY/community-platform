import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profilesService } from 'src/services/profileService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { DBProfile } from 'src/models/profile.model'

export async function action({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const { valid, status, statusText } = await validateRequest(request, params)

  if (!valid) {
    return Response.json({}, { status, statusText })
  }

  const formData = await request.formData()

  const profileResult = await client
    .from('profiles')
    .select()
    .eq('username', params.username)
    .single()

  if (!profileResult.data || profileResult.error) {
    return Response.json({}, { status: 404, statusText: 'profile not found' })
  }

  const profile = profileResult.data as DBProfile
  const file = formData.get('image') as File

  if (file) {
    const { data, error } = await client.storage
      .from(process.env.TENANT_ID!)
      .upload(`profiles/${profile.id}.${file.name.split('.').pop()}`, file, {
        contentType: file.type,
      })

    if (error) {
      return Response.json(
        {},
        { status: 500, statusText: 'error uploading file' },
      )
    }

    profile.photo_url = data.fullPath
  }

  const profileToUpdate: Partial<DBProfile> = profileUpdate(formData)

  await client
    .from('profiles')
    .update(profileToUpdate)
    .eq('username', params.username)

  return Response.json({}, { headers, status: 200 })
}

function profileUpdate(formData: FormData) {
  const profileToUpdate: Partial<DBProfile> = {}

  if (formData.has('displayName')) {
    profileToUpdate.display_name = formData.get('displayName') as string
  }

  if (formData.has('about')) {
    profileToUpdate.about = formData.get('about') as string
  }

  if (formData.has('country')) {
    profileToUpdate.country = formData.get('country') as string
  }

  return profileToUpdate
}

async function validateRequest(request: Request, params: Params<string>) {
  const { valid, user_id } = await verifyFirebaseToken(
    request.headers.get('firebaseToken')!,
  )

  if (!valid) {
    return { valid: false, status: 401, statusText: 'unauthorized' }
  }

  if (!user_id) {
    return { valid: false, status: 400, statusText: 'user not found' }
  }

  const user = await profilesService.getProfileByFirebaseAuthId(
    request,
    user_id,
  )

  if (!user) {
    return { valid: false, status: 400, statusText: 'user not found' }
  }

  if (user.username !== params.username && !profilesService.isUserAdmin(user)) {
    return { valid: false, status: 403, statusText: 'Forbidden' }
  }

  return { valid: true }
}
