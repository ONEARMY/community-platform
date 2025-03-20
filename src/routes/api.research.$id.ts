import { ResearchItem } from 'src/models/research.model'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { convertToSlug } from 'src/utils/slug'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBResearchItem } from 'src/models/research.model'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = Number(params.id)
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

    const currentResearchResult = await client
      .from('research')
      .select()
      .eq('id', id)
      .limit(1)
    const currentResearch = currentResearchResult.data?.at(0) as DBResearchItem
    const newSlug = convertToSlug(data.title)

    if (
      currentResearch.slug !== newSlug &&
      (await isDuplicateSlug(newSlug, client))
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This research already exists',
        },
      )
    }

    const uploadedImages = formData.getAll('images') as File[]
    const uploadedFiles = formData.getAll('files') as File[]
    const imageValidation = validateImages(uploadedImages)
    const fileValidation = validateFiles(uploadedFiles)

    if (!imageValidation.valid) {
      return Response.json(
        {},
        {
          status: 400,
          statusText: imageValidation.errors.join(', '),
        },
      )
    }

    let previousSlugs = currentResearch.previous_slugs
    if (currentResearch.slug !== newSlug) {
      previousSlugs = previousSlugs
        ? [...previousSlugs, currentResearch.slug]
        : [currentResearch.slug]
    }

    const researchResult = await client
      .from('research')
      .update({
        title: data.title,
        description: data.description,
        slug: newSlug,
        category: data.category,
        tags: data.tags,
        previous_slugs: previousSlugs,
      })
      .eq('id', id)
      .select()

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error
    }

    const research = ResearchItem.fromDB(researchResult.data[0], [])

    if (uploadedImages.length > 0) {
      const researchId = Number(researchResult.data[0].id)

      const imageResult = await uploadImages(researchId, uploadedImages, client)

      if (imageResult?.images && imageResult.images.length > 0) {
        const updateResult = await client
          .from('research')
          .update({ images: imageResult.images })
          .eq('id', researchId)
          .select()

        if (updateResult.data) {
          research.images = updateResult.data[0].images
        }
      }
    }

    if (uploadedImages.length > 0) {
      const researchId = Number(researchResult.data[0].id)

      const imageResult = await uploadImages(researchId, uploadedImages, client)

      if (imageResult?.images && imageResult.images.length > 0) {
        const updateResult = await client
          .from('research')
          .update({ images: imageResult.images })
          .eq('id', researchId)
          .select()

        if (updateResult.data) {
          research.images = updateResult.data[0].images
        }
      }
    }

    return Response.json({ research }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function isDuplicateSlug(slug: string, client: SupabaseClient) {
  const { data } = await client
    .from('research')
    .select('slug')
    .eq('slug', slug)
    .single()

  return !!data
}

async function uploadImages(
  researchId: number,
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
      .upload(`research/${researchId}/${image.name}`, image)

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
    if (!SUPPORTED_IMAGE_TYPES.includes(image.type)) {
      errors.push(`Unsupported image extension: ${image.type}`)
      continue
    }
  }

  return { valid: errors.length === 0, errors }
}

function validateFiles(images: File[]) {
  const errors: string[] = []
  for (const image of images) {
    if (!SUPPORTED_IMAGE_TYPES.includes(image.type)) {
      errors.push(`Unsupported image extension: ${image.type}`)
      continue
    }
  }

  return { valid: errors.length === 0, errors }
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
