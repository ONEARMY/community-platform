import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { Comment, DBComment } from 'src/models/comment.model'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { notificationsService } from 'src/services/notificationsService.server'

import type { DBCommentAuthor } from 'src/models/comment.model'
import type { DBProfile } from 'src/models/profile.model'

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.sourceId) {
    return json({}, { status: 400, statusText: 'sourceId is required' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  const sourceParam = isNaN(+params.sourceId) ? 'source_id_legacy' : 'source_id'
  const sourceId = isNaN(+params.sourceId) ? params.sourceId : +params.sourceId

  const result = await client
    .from('comments')
    .select(
      `
      id, 
      comment, 
      created_at, 
      modified_at, 
      deleted, 
      source_id, 
      source_id_legacy,
      source_type,
      parent_id,
      created_by,
      profiles(id, firebase_auth_id, display_name, is_verified, photo_url, country)
    `,
    )
    .eq(sourceParam, sourceId)

  if (result.error) {
    console.error(result.error)

    return json({}, { headers, status: 500 })
  }

  const dbComments = result.data.map(
    (x) =>
      new DBComment({
        ...x,
        profile: x.profiles as unknown as DBCommentAuthor,
      }),
  )

  const commentsByParentId = dbComments.reduce((acc, comment) => {
    const parentId = comment.parent_id ?? 0
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(comment)
    return acc
  }, {})

  const commentWithReplies = (commentsByParentId[0] ?? []).map(
    (mainComment: DBComment) => {
      const replies = (commentsByParentId[mainComment.id] ?? []).map(
        (reply: DBComment) => Comment.fromDB(reply),
      )
      return Comment.fromDB(mainComment, replies)
    },
  )

  return json({ comments: commentWithReplies }, { headers })
}

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

  if (!params.sourceId) {
    return json({}, { status: 400, statusText: 'sourceId is required' })
  }

  if (request.method !== 'POST') {
    return json({}, { status: 405, statusText: 'method not allowed' })
  }

  const data = await request.json()

  if (!data.comment) {
    return json({}, { status: 400, statusText: 'comment is required' })
  }

  if (!data.sourceType) {
    return json({}, { status: 400, statusText: 'sourceType is required' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  const currentUser = await client
    .from('profiles')
    .select()
    .eq('firebase_auth_id', user_id)
    .single()

  if (currentUser.error || !currentUser.data) {
    return json({}, { status: 400, statusText: 'profile not found ' + user_id })
  }

  const newComment = {
    comment: data.comment,
    source_id_legacy:
      typeof params.sourceId === 'string' ? params.sourceId : null,
    source_id: typeof params.sourceId === 'number' ? params.sourceId : null,
    source_type: data.sourceType,
    created_by: currentUser.data.id,
    parent_id: data.parentId ?? null,
    tenant_id: process.env.TENANT_ID,
  } as Partial<DBComment>

  const commentResult = await client
    .from('comments')
    .insert(newComment)
    .select(
      `
      id, 
      comment, 
      created_at, 
      modified_at, 
      deleted, 
      source_id, 
      source_id_legacy, 
      parent_id,
      source_type,
      created_by,
      profiles(id, firebase_auth_id, display_name, is_verified, photo_url, country)
    `,
    )
    .single()

  if (!commentResult.error) {
    // Do not await
    notificationsService.sendCommentNotification(
      client,
      commentResult.data as DBComment,
      currentUser.data as DBProfile,
    )
  }

  return json(
    new DBComment({
      ...(commentResult.data as DBComment),
      profile: (commentResult.data as any).profiles as DBCommentAuthor,
    }),
    {
      headers,
      status: commentResult.error ? 500 : 201,
    },
  )
}
