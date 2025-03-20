import { UserRole } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { DBProfile } from 'src/models/profile.model'
import type { DBResearchItem } from 'src/models/research.model'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = Number(params.id)
    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(request, user)

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const profileRequest = await client
      .from('profiles')
      .select('id,roles')
      .eq('auth_id', user!.id)
      .limit(1)

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      console.log(profileRequest.error)
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const profile = profileRequest.data[0] as DBProfile

    const researchResult = await client
      .from('research')
      .select('id,created_by,collaborators')
      .eq('id', id)

    if (researchResult.error || !researchResult?.data?.at(0)) {
      throw researchResult.error
    }

    const research = researchResult.data[0] as unknown as DBResearchItem

    if (!canDelete(research, profile)) {
      return Response.json(null, { headers, status: 403 })
    }

    await client.from('research').update({ deleted: true }).eq('id', id)

    return Response.json(null, { headers, status: 204 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}
async function canDelete(research: DBResearchItem, profile: DBProfile) {
  return (
    profile.roles?.includes(UserRole.ADMIN) ||
    profile.roles?.includes(UserRole.SUPER_ADMIN) ||
    research.created_by === profile.id ||
    research.collaborators?.includes(profile.id)
  )
}

async function validateRequest(request: Request, user: User | null) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PATCH') {
    return { status: 405, statusText: 'method not allowed' }
  }

  return { valid: true }
}
