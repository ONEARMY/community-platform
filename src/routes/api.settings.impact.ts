import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ImpactServiceServer } from 'src/services/impactService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { IImpactDataField, IUserImpact } from 'oa-shared'

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

    const formData = await request.formData()
    const data = {
      year: Number(formData.get('year')),
      fields: formData.get('fields') as string,
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
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

    return Response.json({ impact }, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error saving impact', headers },
    )
  }
}

async function validateRequest(request: Request, user: User | null, data: any) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

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
