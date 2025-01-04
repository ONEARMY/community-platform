// TODO: split this in separate files once we update remix to NOT use file-based routing

import { IModerationStatus } from 'oa-shared'
import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { Question } from 'src/models/question.model'
import { ITEMS_PER_PAGE } from 'src/pages/Question/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { convertToSlug } from 'src/utils/slug'
import { SUPPORTED_IMAGE_EXTENSIONS } from 'src/utils/storage'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBQuestion } from 'src/models/question.model'
import type { QuestionSortOption } from 'src/pages/Question/QuestionSortOptions'

export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const q = params.get('q')
  const category = Number(params.get('category')) || undefined
  const sort = params.get('sort') as QuestionSortOption
  const skip = Number(params.get('skip')) || 0

  const { client, headers } = createSupabaseServerClient(request)

  let query = client.from('questions').select(
    `
      id,
      created_at,
      created_by,
      modified_at,
      comment_count,
      description,
      slug,
      category:category(id,name),
      tags,
      title,
      total_views,
      author:profiles(id, display_name, username, is_verified, country)`,
    { count: 'exact' },
  )

  if (q) {
    query = query.textSearch('questions_search_fields', q)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (sort === 'Newest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'LatestUpdated') {
    query = query.order('modified_at', { ascending: false })
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
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
    }

    const tokenValidation = await verifyFirebaseToken(
      request.headers.get('firebaseToken')!,
    )
    const { client, headers } = createSupabaseServerClient(request)

    const { valid, status, statusText } = await validateRequest(
      request,
      tokenValidation.valid,
      tokenValidation.user_id,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const slug = convertToSlug(data.title)

    if (await isDuplicateSlug(slug, client)) {
      return Response.json({
        status: 409,
        statusText: 'This question already exists',
      })
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
    const userRequest = await client
      .from('profiles')
      .select()
      .eq('firebase_auth_id', tokenValidation.user_id)
      .single()

    if (userRequest.error || !userRequest.data) {
      console.log(userRequest.error)
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const user = userRequest.data

    const questionResult = await client
      .from('questions')
      .insert({
        created_by: user.id,
        title: data.title,
        description: data.description,
        moderation: IModerationStatus.ACCEPTED,
        slug,
        category: data.category,
        tags: data.tags,
        tenant_id: process.env.TENANT_ID,
      })
      .select()

    if (questionResult.error || !questionResult.data) {
      throw questionResult.error
    }

    const question = Question.fromDB(questionResult.data[0], [])

    if (uploadedImages.length > 0) {
      const questionId = Number(questionResult.data[0].id)

      const imageResult = await uploadImages(questionId, uploadedImages, client)

      if (imageResult?.images && imageResult.images.length > 0) {
        const updateResult = await client
          .from('questions')
          .update({ images: imageResult.images })
          .eq('id', questionId)
          .select()

        if (updateResult.data) {
          question.images = updateResult.data[0].images
        }
      }
    }

    return Response.json({ question }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating question' },
    )
  }
}

async function isDuplicateSlug(slug: string, client: SupabaseClient) {
  const { data } = await client
    .from('questions')
    .select('slug')
    .eq('slug', slug)
    .single()

  return !!data
}

async function uploadImages(
  questionId: number,
  uploadedImages: File[],
  client: SupabaseClient,
) {
  if (!uploadedImages || uploadedImages.length === 0) {
    return null
  }

  // const files = await Promise.all(uploadedImages.map(image => image.arrayBuffer()))

  const errors: string[] = []
  const images: { id: string; path: string; fullPath: string }[] = []

  for (const image of uploadedImages) {
    const result = await client.storage
      .from(process.env.TENANT_ID as string)
      .upload(`questions/${questionId}/${image.name}`, image)

    if (result.data === null) {
      errors.push(`Error uploading image: ${image.name}`)
      continue
    }

    images.push(result.data)
  }

  return { images, errors }
}

function validateImages(images: File[]) {
  const errors: string[] = []
  for (const image of images) {
    if (!SUPPORTED_IMAGE_EXTENSIONS.includes(image.type)) {
      errors.push(`Unsupported image extension: ${image.type}`)
      continue
    }
  }

  return { valid: errors.length === 0, errors }
}

async function validateRequest(
  request: Request,
  isTokenValid: boolean,
  userId: string,
  data: any,
) {
  if (!isTokenValid) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (!userId) {
    return { status: 400, statusText: 'user not found' }
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
