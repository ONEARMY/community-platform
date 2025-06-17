import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { researchServiceServer } from 'src/services/researchService.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { ResearchStatus } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = Number(params.id)
    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const formData = await request.formData()

    const data = {
      status: formData.get('status') as ResearchStatus,
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const canEdit = await researchServiceServer.isAllowedToEditResearchById(
      client,
      id,
      user!.user_metadata.username,
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

    return Response.json(null, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function validateRequest(
  request: Request,
  user: User | null,
  data: { status: ResearchStatus },
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PATCH') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (data.status !== 'complete' && data.status !== 'in-progress') {
    return { status: 400, statusText: 'invalid status' }
  }

  return { valid: true }
}
