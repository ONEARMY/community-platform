import { UserRole } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBComment, DBProfile } from 'oa-shared'

type Supabase = {
  headers: Headers
  client: SupabaseClient<any, 'public', any>
}

export async function action({ params, request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await supabase.client.auth.getUser()

  const { valid, status, statusText } = await validateRequest(
    params,
    request,
    user,
  )

  if (!valid) {
    return Response.json({}, { status, statusText })
  }

  const profile = await getProfileByAuthId(request, user!.id)

  if (!profile) {
    return Response.json({}, { status: 400, statusText: 'user not found' })
  }

  const commentId: string = params.id!

  if (request.method === 'DELETE') {
    return deleteComment(supabase, commentId, profile)
  }

  return updateComment(supabase, request, commentId, profile)
}

async function updateComment(
  { client, headers }: Supabase,
  request: Request,
  id: string,
  user: DBProfile,
) {
  const json = await request.json()

  if (!json.comment) {
    return json({}, { status: 400, statusText: 'comment is required' })
  }

  const { data, error } = await client
    .from('comments')
    .select()
    .eq('id', id)
    .single()

  if (error || !data) {
    return json({}, { status: 404, statusText: 'comment not found' })
  }

  const comment = data as DBComment

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return json({}, { status: 403, statusText: 'forbidden' })
  }

  const result = await client
    .from('comments')
    .update({ comment: json.comment })
    .eq('id', id)

  if (result.error) {
    console.error(result.error)
    return json(
      {},
      { headers, status: 500, statusText: 'Error updating comment' },
    )
  }

  return new Response(null, { headers, status: 204 })
}

async function deleteComment(
  { client, headers }: Supabase,
  id: string,
  user: DBProfile,
) {
  const { data, error } = await client
    .from('comments')
    .select()
    .eq('id', id)
    .single()

  if (error || !data) {
    return Response.json({}, { status: 404, statusText: 'comment not found' })
  }

  const comment = data as DBComment

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return Response.json({}, { status: 403, statusText: 'forbidden' })
  }

  const result = await client
    .from('comments')
    .update({ deleted: true })
    .eq('id', id)

  if (result.error) {
    console.error(result.error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error deleting comment' },
    )
  }

  return new Response(null, { headers, status: 204 })
}

async function getProfileByAuthId(request: Request, authId: string) {
  const { client } = createSupabaseServerClient(request)

  const { data, error } = await client
    .from('profiles')
    .select()
    .eq('auth_id', authId)
    .limit(1)

  if (error || !data?.at(0)) {
    return null
  }

  return data[0] as DBProfile
}

function isUserAdmin(user: DBProfile) {
  return (
    user.roles &&
    user.roles.includes(UserRole.ADMIN) &&
    user.roles.includes(UserRole.SUPER_ADMIN)
  )
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (!params.sourceId) {
    return { status: 400, statusText: 'sourceId is required' }
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' }
  }

  if (request.method !== 'PUT' && request.method !== 'DELETE') {
    return { status: 405, statusText: 'method not allowed' }
  }

  return { valid: true }
}
