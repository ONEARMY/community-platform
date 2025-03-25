import { Question } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { hasAdminRightsSupabase } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'

import { uploadImages, validateImages } from './api.questions'
import { isDuplicateExistingSlug } from './utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBImage, DBProfile, DBQuestion } from 'oa-shared'

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData()
    const imagesToKeepIds = formData.getAll('existingImages')

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category')
        ? Number(formData.get('category'))
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
      params,
      request,
      user,
      data,
      client,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
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

    const questionId = Number(params.id)

    let images: DBImage[] = []

    if (imagesToKeepIds.length > 0) {
      const questionImages = await client
        .from('questions')
        .select('images')
        .eq('id', params.id)
        .single()

      if (questionImages.data && questionImages.data?.images?.length > 0) {
        images = questionImages.data.images.filter((x) =>
          imagesToKeepIds.includes(x.id),
        )
      }
    }

    if (uploadedImages.length > 0) {
      const imageResult = await uploadImages(questionId, uploadedImages, client)

      if (imageResult) {
        images = [...images, ...imageResult.images]
      }
    }

    const slug = convertToSlug(data.title)
    const questionResult = await client
      .from('questions')
      .update({
        title: data.title,
        description: data.description,
        slug,
        category: data.category,
        tags: data.tags,
        images,
      })
      .eq('id', params.id)
      .select()

    if (questionResult.error || !questionResult.data) {
      throw questionResult.error
    }

    const question = Question.fromDB(questionResult.data[0], [])

    return Response.json({ question }, { headers, status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating question' },
    )
  }
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
  const images: DBImage[] = []

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
  params: Params<string>,
  request: Request,
  user: User | null,
  data: any,
  client: SupabaseClient,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' }
  }

  const slug = convertToSlug(data.title)
  const questionId = Number(params.id!)

  if (await isDuplicateExistingSlug(slug, questionId, client, 'questions')) {
    return {
      status: 409,
      statusText: 'This question already exists',
    }
  }

  const existingQuestionResult = await client
    .from('questions')
    .select()
    .eq('id', questionId)
    .single()

  if (existingQuestionResult.error || !existingQuestionResult.data) {
    return { status: 400, statusText: 'Question not found' }
  }

  const existingQuestion = existingQuestionResult.data as DBQuestion

  const profileRequest = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', user.id)
    .limit(1)

  if (profileRequest.error || !profileRequest.data?.at(0)) {
    return { status: 400, statusText: 'User not found' }
  }

  const profile = profileRequest.data[0] as DBProfile
  const isCreator = existingQuestion.created_by === profile.id
  const hasAdminRights = hasAdminRightsSupabase(profile)

  if (!isCreator && !hasAdminRights) {
    return { status: 403, statusText: 'Unauthorized' }
  }

  return { valid: true }
}
