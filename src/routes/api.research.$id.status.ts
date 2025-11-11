import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { ResearchStatus } from 'oa-shared'
import type { ActionFunctionArgs } from 'react-router'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const id = Number(params.id)

    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const formData = await request.formData()

    const data = {
      status: formData.get('status') as ResearchStatus,
    }

    const { valid, status, statusText } = await validateRequest(request, data)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const canEdit = await researchServiceServer.isAllowedToEditResearchById(
      client,
      id,
      claims.data.claims.user_metadata.username,
    )

    if (!canEdit) {
      return Response.json(null, { headers, status: 403 })
    }

    const result = await client
      .from('research')
      .update({ status: data.status })
      .eq('id', id)

    if (result.error) {
      throw result.error
    }

    updateUserActivity(client, claims.data.claims.sub)

    return Response.json(null, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error creating research' },
    )
  }
}

async function validateRequest(
  request: Request,
  data: { status: ResearchStatus },
) {
  if (request.method !== 'PATCH') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (data.status !== 'complete' && data.status !== 'in-progress') {
    return { status: 400, statusText: 'invalid status' }
  }

  return { valid: true }
}
