import { ResearchUpdate } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBMedia, DBResearchUpdate, MediaFile } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const researchId = Number(params.id)
    const updateId = Number(params.updateId)

    if (request.method === 'DELETE') {
      return await deleteResearchUpdate(request, researchId, updateId)
    }

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

    const profile = await profileServiceServer.getByAuthId(
      user?.id || '',
      client,
    )

    if (
      !researchServiceServer.isAllowedToEditUpdate(
        profile,
        researchId,
        updateId,
        client,
      )
    ) {
      return Response.json({}, { status: 403, headers })
    }

    const researchUpdateResult = await client
      .from('research_updates')
      .select()
      .eq('id', updateId)
      .single()
    const update = researchUpdateResult.data as DBResearchUpdate

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

    const uploadPath = `research/${researchId}/updates/${update.id}`
    const images = await updateOrReplaceImage(
      imagesToKeepIds as string[],
      uploadedImages,
      updateId,
      uploadPath,
      client,
    )

    const files = await updateOrReplaceFile(
      filesToKeepIds as string[],
      uploadedFiles,
      updateId,
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
        modified_at: new Date(),
        video_url: data.videoUrl,
        files: files.map((x) => ({ id: x.id, name: x.name, size: x.size })),
      })
      .eq('id', update.id)
      .select()

    if (updateResult.error || !updateResult.data) {
      throw updateResult.error
    }

    const researchUpdate = ResearchUpdate.fromDB(updateResult.data[0], [])

    return Response.json({ researchUpdate }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function updateOrReplaceImage(
  idsToKeep: string[],
  newUploads: File[],
  updateId: number,
  path: string,
  client: SupabaseClient,
) {
  let media: DBMedia[] = []

  if (idsToKeep.length > 0) {
    const existingMedia = await client
      .from('research_updates')
      .select('images')
      .eq('id', updateId)
      .single()

    if (existingMedia.data && existingMedia.data.images?.length > 0) {
      media = existingMedia.data.images.filter((x) => idsToKeep.includes(x.id))
    }
  }

  if (newUploads.length > 0) {
    const result = await storageServiceServer.uploadImage(
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

async function updateOrReplaceFile(
  idsToKeep: string[],
  newUploads: File[],
  updateId: number,
  path: string,
  client: SupabaseClient,
) {
  let media: MediaFile[] = []

  if (idsToKeep.length > 0) {
    const existingMedia = await client
      .from('research_updates')
      .select('files')
      .eq('id', updateId)
      .single()

    if (existingMedia.data && existingMedia.data.files?.length > 0) {
      media = existingMedia.data.files.filter((x) => idsToKeep.includes(x.id))
    }
  }

  if (newUploads.length > 0) {
    const result = await storageServiceServer.uploadFile(
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

async function deleteResearchUpdate(request, id: number, updateId: number) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  const profile = await profileServiceServer.getByAuthId(user?.id || '', client)

  if (
    !researchServiceServer.isAllowedToEditUpdate(profile, id, updateId, client)
  ) {
    return Response.json({}, { status: 403, headers })
  }

  await client
    .from('research_updates')
    .update({
      deleted: true,
    })
    .eq('id', updateId)

  return Response.json({}, { status: 200, headers })
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
