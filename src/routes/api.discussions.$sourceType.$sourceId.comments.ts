import { DBComment } from 'oa-shared'
import { CommentFactory } from 'src/factories/commentFactory.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ImageServiceServer } from 'src/services/imageService.server'
import { notificationsSupabaseServiceServer } from 'src/services/notificationSupabaseService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBAuthor, DBProfile, DiscussionContentTypes } from 'oa-shared'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  if (!params.sourceId) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'sourceId is required' },
    )
  }
  try {
    const {
      data: { user },
    } = await client.auth.getUser()
    let currentUserId: number | null = null

    if (user?.id) {
      const profileResult = await client
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (!profileResult.error) {
        currentUserId = profileResult.data.id
      }
    }

    const result = await client.rpc('get_comments_with_votes', {
      p_source_type: params.sourceType,
      p_source_id: params.sourceId,
      p_current_user_id: currentUserId || null,
    })

    const dbComments = result.data as DBComment[]

    const commentFactory = new CommentFactory(new ImageServiceServer(client))
    const comments = await commentFactory.fromDBCommentsToThreads(dbComments)

    return Response.json({ comments }, { headers })
  } catch (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }
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
    return Response.json({}, { headers, status, statusText })
  }

  const currentUser = await client
    .from('profiles')
    .select()
    .eq('auth_id', user!.id)
    .limit(1)

  if (currentUser.error || !currentUser.data?.at(0)) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'profile not found ' + user!.id },
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
      profiles(id, display_name, username, photo, country, badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
        )
      ))
    `,
    )
    .single()

  if (!commentResult.error) {
    const comment = commentResult.data as DBComment
    const profile = currentUser.data[0] as DBProfile

    addSubscriptions(comment, profile, client, headers)

    notificationsSupabaseServiceServer.createNotificationsNewComment(
      comment,
      client,
      headers,
    )
  }

  const commentDb = new DBComment({
    ...(commentResult.data as DBComment),
    profile: (commentResult.data as any).profiles as DBAuthor,
  })

  const commentFactory = new CommentFactory(new ImageServiceServer(client))
  const comment = await commentFactory.fromDBWithAuthor(commentDb)

  return Response.json(comment, {
    headers,
    status: commentResult.error ? 500 : 201,
  })
}

function addSubscriptions(
  comment: DBComment,
  profile: DBProfile,
  client: SupabaseClient,
  headers: Headers,
) {
  if (comment.source_id && !comment.parent_id) {
    // Subscribe to peer comments...
    subscribersServiceServer.add(
      comment.source_type,
      comment.source_id,
      profile.id,
      client,
      headers,
    )
    // ...add replies to this comment
    subscribersServiceServer.add(
      'comments',
      comment.id,
      profile.id,
      client,
      headers,
    )
  }

  if (comment.source_id && comment.parent_id) {
    // Subscribe to the parent of this reply
    subscribersServiceServer.add(
      'comments',
      comment.parent_id,
      profile.id,
      client,
      headers,
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
