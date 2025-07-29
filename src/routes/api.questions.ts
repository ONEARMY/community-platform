// TODO: split this in separate files once we update remix to NOT use file-based routing

import { Question } from 'oa-shared'
import { ITEMS_PER_PAGE } from 'src/pages/Question/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { discordServiceServer } from 'src/services/discordService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'
import { validateImages } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { DBProfile, DBQuestion, Moderation } from 'oa-shared'
import type { QuestionSortOption } from 'src/pages/Question/QuestionSortOptions'

export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const q = params.get('q')
  const category = Number(params.get('category')) || undefined
  const sort = params.get('sort') as QuestionSortOption
  const skip = Number(params.get('skip')) || 0

  const { client, headers } = createSupabaseServerClient(request)

  let query = client
    .from('questions')
    .select(
      `
      id,
      author:profiles(id, display_name, username, is_verified, is_supporter, country),
      category:category(id,name),
      created_at,
      created_by,
      modified_at,
      comment_count,
      description,
      is_draft,
      slug,
      tags,
      title,
      total_views`,
      { count: 'exact' },
    )
    .eq('is_draft', false)

  if (q) {
    query = query.textSearch('questions_search_fields', q)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (sort === 'Newest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'Comments') {
    query = query.order('comment_count', { ascending: false })
  } else if (sort === 'LeastComments') {
    query = query.order('comment_count', { ascending: true })
  }

  const queryResult = await query.range(skip, skip + ITEMS_PER_PAGE) // 0 based

  const total = queryResult.count
  const data = queryResult.data as unknown as DBQuestion[]

  const items = data.map((x) => Question.fromDB(x, [], []))

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'questions',
      p_content_ids: items.map((x) => x.id),
    })

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count)
        return acc
      }, new Map())

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!
        }
      }
    }
  }

  return Response.json({ items, total }, { headers })
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      is_draft: formData.get('is_draft') === 'true',
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
    }

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const slug = convertToSlug(data.title)

    if (
      await contentServiceServer.isDuplicateNewSlug(slug, client, 'questions')
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This question already exists',
        },
      )
    }

    const uploadedImages = formData.getAll('images') as File[]
    const imageValidation = validateImages(uploadedImages)

    if (!imageValidation.valid) {
      return Response.json(
        {},
        {
          status: 400,
          statusText: imageValidation.errors.join(', '),
        },
      )
    }
    const profileRequest = await client
      .from('profiles')
      .select('id,username')
      .eq('auth_id', user!.id)
      .limit(1)

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      console.error(profileRequest.error)
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const profile = profileRequest.data[0] as DBProfile

    const questionResult = await client
      .from('questions')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        is_draft: data.is_draft,
        moderation: 'accepted' as Moderation,
        slug,
        category: data.category,
        tags: data.tags,
        tenant_id: process.env.TENANT_ID,
      })
      .select()

    if (questionResult.error || !questionResult.data) {
      return Response.json(
        {},
        { status: 400, statusText: questionResult.error.details },
      )
    }

    const question = Question.fromDB(questionResult.data[0], [])
    subscribersServiceServer.add('questions', question.id, profile.id, client)

    if (uploadedImages.length > 0) {
      const questionId = Number(questionResult.data[0].id)

      const imageResult = await storageServiceServer.uploadImage(
        uploadedImages,
        `questions/${questionId}`,
        client,
      )

      if (imageResult?.media && imageResult.media.length > 0) {
        const updateResult = await client
          .from('questions')
          .update({ images: imageResult.media })
          .eq('id', questionId)
          .select()

        if (updateResult.data) {
          question.images = updateResult.data[0].images
        }
      }
    }

    if (!question.isDraft) {
      notifyDiscord(
        question,
        profile,
        new URL(request.url).origin.replace('http:', 'https:'),
      )
    }

    return Response.json({ question }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating question' },
    )
  }
}

function notifyDiscord(
  question: Question,
  profile: DBProfile,
  siteUrl: string,
) {
  const title = question.title
  const slug = question.slug

  discordServiceServer.postWebhookRequest(
    `❓ ${profile.username} has a new question: ${title}\nHelp them out and answer here: <${siteUrl}/questions/${slug}>`,
  )
}

async function validateRequest(request: Request, user: User | null, data: any) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' }
  }

  return { valid: true }
}
