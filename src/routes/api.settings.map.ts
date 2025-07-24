import { MapPinFactory } from 'src/factories/mapPinFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { MapServiceServer } from 'src/services/mapService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { DBMapPin, DBProfile, UpsertPin } from 'shared/lib'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) {
      return { status: 401, statusText: 'unauthorized' }
    }

    const profileService = new ProfileServiceServer(client)
    const profile = await profileService.getByAuthId(user!.id)

    if (!profile) {
      return { status: 404, statusText: 'profile not found' }
    }

    if (request.method === 'DELETE') {
      return await deletePin(request, profile)
    }

    const formData = await request.formData()
    const data: UpsertPin = {
      name: formData.get('name') as string,
      country: formData.get('country') as string,
      country_code: formData.get('countryCode') as string,
      administrative: formData.get('administrative') as string,
      post_code: formData.get('postCode') as string,
      lat: Number(formData.get('lat')),
      lng: Number(formData.get('lng')),
      profile_id: profile.id,
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const mapService = new MapServiceServer(client)
    const result = await mapService.upsert(data)

    if (result?.error) {
      console.error(result.error)
      return Response.json(
        {},
        { headers, status: 500, statusText: 'Error saving map pin' },
      )
    }

    const pinFactory = new MapPinFactory(client)
    const mapPin = pinFactory.fromDBWithProfile(
      result.data as unknown as DBMapPin,
    )

    return Response.json({ mapPin }, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creatsavinging map pin', headers },
    )
  }
}

async function validateRequest(
  request: Request,
  user: User | null,
  data: UpsertPin,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }
  if (!data.country) {
    return { status: 400, statusText: 'country is required' }
  }
  if (!data.country_code) {
    return { status: 400, statusText: 'countryCode is required' }
  }
  if (!data.lat) {
    return { status: 400, statusText: 'lat is required' }
  }
  if (!data.lng) {
    return { status: 400, statusText: 'lng is required' }
  }

  return { valid: true }
}

async function deletePin(request: Request, profile: DBProfile) {
  const { client, headers } = createSupabaseServerClient(request)

  const { error } = await client
    .from('map_pins')
    .delete()
    .eq('profile_id', profile.id)

  if (error) {
    console.error(error)

    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error deleting pin' },
    )
  }

  return Response.json({}, { headers, status: 200 })
}
