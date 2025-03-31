import { ResearchUpdate } from 'src/models/research.model'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { mediaServiceServer } from 'src/services/mediaService.server'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBMedia } from 'src/models/image.model'
import type { DBResearchUpdate } from 'src/models/research.model'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const researchId = Number(params.id)
    const updateId = Number(params.updateId)
    const formData = await request.formData()
    const imagesToKeepIds = formData.getAll('existingImages')
    const filesToKeepIds = formData.getAll('existingFiles')

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      videoUrl: formData.get('videoUrl') as string,
      fileUrl: formData.get('fileUrl') as string,
      isDraft: formData.get('draft') === 'true',
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

    const researchUpdateResult = await client
      .from('research_updates')
      .select()
      .eq('id', updateId)
      .limit(1)
    const update = researchUpdateResult.data?.at(0) as DBResearchUpdate

    const uploadedImages = formData.getAll('images') as File[]
    const uploadedFiles = formData.getAll('files') as File[]
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

    const uploadPath = `research/${researchId}`
    const images = await updateOrReplaceMedia(
      imagesToKeepIds as string[],
      uploadedImages,
      updateId,
      'images',
      uploadPath,
      client,
    )

    const files = await updateOrReplaceMedia(
      filesToKeepIds as string[],
      uploadedFiles,
      updateId,
      'files',
      uploadPath,
      client,
    )

    const updateResult = await client
      .from('research_updates')
      .update({
        title: data.title,
        description: data.description,
        is_draft: data.isDraft,
        images,
        files,
      })
      .eq('id', update.id)
      .select()

    if (updateResult.error || !updateResult.data) {
      throw updateResult.error
    }

    const researchUpdate = ResearchUpdate.fromDB(updateResult.data[0], [])

    return Response.json({ research: researchUpdate }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function updateOrReplaceMedia(
  idsToKeep: string[],
  newUploads: File[],
  updateId: number,
  type: 'images' | 'files',
  path: string,
  client: SupabaseClient,
) {
  let media: DBMedia[] = []

  if (idsToKeep.length > 0) {
    const existingMedia = await client
      .from('research_updates')
      .select(type)
      .eq('id', updateId)
      .single()

    if (existingMedia.data && existingMedia.data[type]?.length > 0) {
      media = existingMedia.data[type].filter((x) => idsToKeep.includes(x.id))
    }
  }

  if (newUploads.length > 0) {
    const result = await mediaServiceServer.uploadMedia(
      newUploads,
      path,
      client,
    )

    if (result) {
      media = [...media, ...result.media]
    }
  }

  return media
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

async function validateRequest(request: Request, user: User | null, data: any) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PUT') {
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
