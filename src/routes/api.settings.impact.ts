import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ImpactServiceServer } from 'src/services/impactService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { ActionFunctionArgs } from 'react-router';
import type { IImpactDataField, IUserImpact } from 'oa-shared'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const profileService = new ProfileServiceServer(client)
    const profile = await profileService.getByAuthId(claims.data.claims.sub)

    if (!profile) {
      return { status: 404, statusText: 'profile not found' }
    }

    const formData = await request.formData()
    const data = {
      year: Number(formData.get('year')),
      fields: formData.get('fields') as string,
    }

    const { valid, status, statusText } = await validateRequest(request, data)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const fields: IImpactDataField[] = JSON.parse(data.fields)
    const impactService = new ImpactServiceServer(client)
    const result = await impactService.update(profile.id, data.year, fields)

    if (result?.error) {
      console.error(result.error)
      return Response.json(
        {},
        { headers, status: 500, statusText: 'Error saving impact' },
      )
    }

    const impact = result.data as unknown as IUserImpact

    updateUserActivity(client, claims.data.claims.sub)

    return Response.json({ impact }, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error saving impact' },
    )
  }
}

async function validateRequest(request: Request, data: any) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }
  if (!data.year) {
    return { status: 400, statusText: 'year is required' }
  }

  if (!data.fields) {
    return { status: 400, statusText: 'fields is required' }
  }

  try {
    const fields: IImpactDataField[] = JSON.parse(data.fields)

    if (!Array.isArray(fields) || !fields?.length) {
      return { status: 400, statusText: 'fields is not valid' }
    }
  } catch (error) {
    return { status: 400, statusText: 'invalid fields' }
  }

  return { valid: true }
}
