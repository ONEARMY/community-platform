import { Comment, DBComment } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { notificationsService } from 'src/services/notificationsService.server'
import { notificationsSupabaseServiceServer } from 'src/services/notificationSupabaseService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  DBAuthor,
  DBProfile,
  DiscussionContentTypes,
  Reply,
} from 'oa-shared'

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.sourceId) {
    return Response.json(
      {},
      { status: 400, statusText: 'sourceId is required' },
    )
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
      profiles(id, firebase_auth_id, display_name, username, is_verified, is_supporter, photo_url, country)
    `,
    )
    .eq('source_type', params.sourceType)
    .eq(sourceParam, sourceId)
    .order('created_at', { ascending: true })

  if (result.error) {
    console.error(result.error)

    return Response.json({}, { headers, status: 500 })
  }

  const dbComments = result.data.map(
    (x) =>
      new DBComment({
        ...x,
        profile: x.profiles as unknown as DBAuthor,
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
      const replies: Reply[] = (commentsByParentId[mainComment.id] ?? []).map(
        (reply: DBComment) => Comment.fromDB(reply),
      )
      return Comment.fromDB(
        mainComment,
        replies.filter((x) => !x.deleted).sort((a, b) => a.id - b.id),
      )
    },
  )

  // remove deleted comments that don't have replies
  const deletedFilter = commentWithReplies.filter(
    (comment: Comment) =>
      !comment.deleted || (comment.replies?.length || 0) > 0,
  )

  return Response.json({ comments: deletedFilter }, { headers })
}

export async function action({ params, request }: LoaderFunctionArgs) {
  const data = await request.json()

  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  const sourceType = mapSourceType(params.sourceType! as DiscussionContentTypes)

  const { valid, status, statusText } = await validateRequest(
    params,
    request,
    user,
    data,
    sourceType,
  )

  if (!valid) {
    return Response.json({}, { status, statusText })
  }

  const currentUser = await client
    .from('profiles')
    .select()
    .eq('auth_id', user!.id)
    .limit(1)

  if (currentUser.error || !currentUser.data?.at(0)) {
    return Response.json(
      {},
      { status: 400, statusText: 'profile not found ' + user!.id },
    )
  }

  const newComment = {
    comment: data.comment,
    source_id_legacy: isNaN(+params.sourceId!) ? params.sourceId : null,
    source_id: isNaN(+params.sourceId!) ? null : +params.sourceId!,
    source_type: sourceType,
    created_by: currentUser.data[0].id,
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
      profiles(id, firebase_auth_id, display_name, username, is_verified, is_supporter, photo_url, country)
    `,
    )
    .single()

  if (!commentResult.error) {
    const comment = commentResult.data as DBComment
    const profile = currentUser.data[0] as DBProfile

    addSubscriptions(comment, profile, client)

    notificationsService.sendCommentNotification(client, comment, profile)
    notificationsSupabaseServiceServer.createNotificationsNewComment(
      comment,
      client,
    )
  }

  return Response.json(
    new DBComment({
      ...(commentResult.data as DBComment),
      profile: (commentResult.data as any).profiles as DBAuthor,
    }),
    {
      headers,
      status: commentResult.error ? 500 : 201,
    },
  )
}

function addSubscriptions(
  comment: DBComment,
  profile: DBProfile,
  client: SupabaseClient,
) {
  if (comment.source_id && !comment.parent_id) {
    // Subscribe to peer comments...
    subscribersServiceServer.add(
      comment.source_type,
      comment.source_id,
      profile.id,
      client,
    )
    // ...add replies to this comment
    subscribersServiceServer.add('comments', comment.id, profile.id, client)
  }

  if (comment.source_id && comment.parent_id) {
    // Subscribe to the parent of this reply
    subscribersServiceServer.add(
      'comments',
      comment.parent_id,
      profile.id,
      client,
    )
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
  data: any,
  sourceType: 'news' | 'research_update' | 'projects' | 'questions' | null,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (!params.sourceId) {
    return { status: 400, statusText: 'sourceId is required' }
  }

  if (!params.sourceType) {
    return { status: 400, statusText: 'sourceType is required' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.comment) {
    return { status: 400, statusText: 'comment is required' }
  }

  if (!sourceType) {
    return { status: 400, statusText: 'invalid sourceType' }
  }

  return { valid: true }
}

const mapSourceType = (sourceType: DiscussionContentTypes) => {
  switch (sourceType) {
    case 'research_update':
      return 'research_update'
    case 'news':
      return 'news'
    case 'projects':
      return 'projects'
    case 'questions':
      return 'questions'
    default:
      throw new Error('Invalid sourceType')
  }
}
