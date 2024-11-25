import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { UserRole } from 'oa-shared'
import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { DBComment } from 'src/models/comment.model'
import type { DBProfile } from 'src/models/profile.model'

export async function action({ params, request }: LoaderFunctionArgs) {
  const { valid, user_id } = await verifyFirebaseToken(
    request.headers.get('firebaseToken')!,
  )

  if (!valid) {
    return json({}, { status: 401, statusText: 'unauthorized' })
  }

  if (!user_id) {
    return json({}, { status: 400, statusText: 'user not found' })
  }

  const user = await getProfileByFirebaseAuthId(request, user_id)

  if (!user) {
    return json({}, { status: 400, statusText: 'user not found' })
  }

  if (!params.sourceId) {
    return json({}, { status: 400, statusText: 'sourceId is required' })
  }

  if (!params.id) {
    return json({}, { status: 400, statusText: 'id is required' })
  }

  if (request.method !== 'PUT' && request.method !== 'DELETE') {
    return json({}, { status: 405, statusText: 'method not allowed' })
  }

  if (request.method === 'DELETE') {
    return deleteComment(request, params.id, user)
  }

  return updateComment(request, params.id, user)
}

async function updateComment(request: Request, id: string, user: DBProfile) {
  const { client, headers } = createSupabaseServerClient(request)

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

async function deleteComment(request: Request, id: string, user: DBProfile) {
  const { client, headers } = createSupabaseServerClient(request)

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
    .update({ deleted: true })
    .eq('id', id)

  if (result.error) {
    console.error(result.error)
    return json(
      {},
      { headers, status: 500, statusText: 'Error deleting comment' },
    )
  }

  return new Response(null, { headers, status: 204 })
}

async function getProfileByFirebaseAuthId(
  request: Request,
  firebaseAuthId: string,
) {
  const { client } = createSupabaseServerClient(request)

  const { data, error } = await client
    .from('profiles')
    .select()
    .eq('firebase_auth_id', firebaseAuthId)
    .single()

  if (error || !data) {
    return null
  }

  return data as DBProfile
}

function isUserAdmin(user: DBProfile) {
  return (
    user.roles &&
    user.roles.includes(UserRole.ADMIN) &&
    user.roles.includes(UserRole.SUPER_ADMIN)
  )
}
