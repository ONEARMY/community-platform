import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { LoaderFunctionArgs } from 'react-router'

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return Response.json(
      {},
      { headers, status: 405, statusText: 'method not allowed' },
    )
  }

  try {
    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }
    const profile = await new ProfileServiceServer(client).getByAuthId(
      claims.data.claims.sub,
    )

    if (!profile) {
      throw { status: 400, statusText: 'user not found' }
    }

    if (request.method === 'POST') {
      const response = await client
        .from('subscribers')
        .select('*')
        .eq('content_type', params.contentType)
        .eq('content_id', Number(params.contentId))
        .eq('user_id', profile.id)
        .single()

      if (response.data) {
        return response.data
      }

      await client.from('subscribers').insert({
        content_type: params.contentType,
        content_id: Number(params.contentId),
        user_id: profile.id,
        tenant_id: process.env.TENANT_ID!,
      })
    }

    if (request.method === 'DELETE') {
      await client
        .from('subscribers')
        .delete()
        .eq('content_type', params.contentType)
        .eq('content_id', Number(params.contentId))
        .eq('user_id', profile.id)
    }

    updateUserActivity(client, claims.data.claims.sub)

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    if (error) {
      console.error(error)
      return Response.json({}, { headers, status: 500, statusText: 'error' })
    }
  }
}
