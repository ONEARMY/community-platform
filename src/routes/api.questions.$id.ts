import { Question } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { hasAdminRightsSupabase } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'
import { validateImages } from 'src/utils/storage'

import { contentServiceServer } from '../services/contentService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBMedia, DBQuestion } from 'oa-shared'

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const id = Number(params.id)

    const formData = await request.formData()
    const imagesToKeepIds = formData.getAll('existingImages')

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category')
        ? Number(formData.get('category'))
        : null,
      is_draft: formData.get('is_draft') === 'true',
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      slug: convertToSlug(formData.get('title') as string),
    }

    const {
      data: { user },
    } = await client.auth.getUser()

    const currentQuestion = await questionServiceServer.getById(id, client)

    const { valid, status, statusText } = await validateRequest(
      params,
      request,
      user,
      data,
      currentQuestion,
      client,
    )

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const uploadedImages = formData.getAll('images') as File[]
    const imageValidation = validateImages(uploadedImages)

    if (!imageValidation.valid) {
      return Response.json(
        {},
        {
          headers,
          status: 400,
          statusText: imageValidation.errors.join(', '),
        },
      )
    }

    let images: DBMedia[] = []

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
      const mediaResult = await storageServiceServer.uploadImage(
        uploadedImages,
        `questions/${id}`,
        client,
      )

      if (mediaResult) {
        images = [...images, ...mediaResult.media]
      }
    }

    const previousSlugs = contentServiceServer.updatePreviousSlugs(
      currentQuestion,
      data.slug,
    )

    const questionResult = await client
      .from('questions')
      .update({
        category: data.category,
        description: data.description,
        is_draft: data.is_draft,
        images,
        title: data.title,
        slug: data.slug,
        previous_slugs: previousSlugs,
        tags: data.tags,
        modified_at: new Date(),
      })
      .eq('id', params.id)
      .select()

    if (questionResult.error || !questionResult.data) {
      throw questionResult.error
    }

    const newImages = storageServiceServer.getPublicUrls(
      client,
      questionResult.data[0].images,
      IMAGE_SIZES.GALLERY,
    )

    const question = Question.fromDB(questionResult.data[0], [], newImages)

    return Response.json({ question }, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error creating question' },
    )
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
  data: any,
  currentQuestion: DBQuestion,
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

  if (!currentQuestion) {
    return { status: 400, statusText: 'Question not found' }
  }

  if (
    currentQuestion.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      data.slug,
      currentQuestion.id,
      client,
      'questions',
    ))
  ) {
    return {
      status: 409,
      statusText: 'This question already exists',
    }
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.getByAuthId(user!.id)

  if (!profile) {
    return { status: 400, statusText: 'User not found' }
  }

  const isCreator = currentQuestion.created_by === profile.id
  const hasAdminRights = hasAdminRightsSupabase(profile)

  if (!isCreator && !hasAdminRights) {
    return { status: 403, statusText: 'Unauthorized' }
  }

  return { valid: true }
}
