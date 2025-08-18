import { ResearchUpdate } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { broadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBMedia, DBProfile, DBResearchUpdate, MediaFile } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const { client, headers } = createSupabaseServerClient(request)

    const researchId = Number(params.id)
    const updateId = Number(params.updateId)
    const formData = await request.formData()

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      videoUrl: formData.get('videoUrl') as string,
      fileUrl: formData.get('fileUrl') as string,
      isDraft: formData.get('draft') === 'true',
    }
    const imagesToKeepIds = formData.getAll('existingImages')
    const filesToKeepIds = formData.getAll('existingFiles')
    const uploadedImages = formData.getAll('images') as File[]
    const uploadedFiles = formData.getAll('files') as File[]
    const userData = await client.auth.getUser()
    const profile = await profileServiceServer.getByAuthId(
      userData.data.user!.id,
      client,
    )

    if (request.method === 'DELETE') {
      return await deleteResearchUpdate(request, researchId, updateId)
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      userData.data.user,
      data,
      profile,
      researchId,
      updateId,
      uploadedImages,
      client,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const researchUpdateResult = await client
      .from('research_updates')
      .select()
      .eq('id', updateId)
      .single()

    const oldResearchUpdate = researchUpdateResult.data as DBResearchUpdate

    const researchUpdateAfterUpdating = await client
      .from('research_updates')
      .update({
        title: data.title,
        description: data.description,
        is_draft: data.isDraft,
        modified_at: new Date(),
        video_url: data.videoUrl,
      })
      .eq('id', oldResearchUpdate.id)
      .select('*,research:research(id,slug,is_draft)')
      .single()

    if (
      researchUpdateAfterUpdating.error ||
      !researchUpdateAfterUpdating.data
    ) {
      throw researchUpdateAfterUpdating.error
    }

    const researchUpdate = ResearchUpdate.fromDB(
      researchUpdateAfterUpdating.data,
      [],
    )
    researchUpdate.research = researchUpdateAfterUpdating.data.research

    try {
      const uploadPath = `research/${researchId}/updates/${oldResearchUpdate.id}`

      await updateOrReplaceImage(
        imagesToKeepIds as string[],
        uploadedImages,
        updateId,
        uploadPath,
        client,
      )

      await updateOrReplaceFile(
        filesToKeepIds as string[],
        uploadedFiles,
        updateId,
        uploadPath,
        client,
      )

      broadcastCoordinationServiceServer.researchUpdate(
        researchUpdate,
        profile,
        client,
        request,
        oldResearchUpdate,
      )

      return Response.json({ researchUpdate }, { headers, status: 201 })
    } catch (error) {
      console.error(error)

      await client
        .from('research_updates')
        .update({
          title: oldResearchUpdate.title,
          description: oldResearchUpdate.description,
          is_draft: oldResearchUpdate.is_draft,
          modified_at: oldResearchUpdate.modified_at,
          video_url: oldResearchUpdate.video_url,
        })
        .eq('id', oldResearchUpdate.id)
        .select('id')
        .single()

      return Response.json(
        {},
        {
          status: 500,
          statusText: 'Error after trying to update research update',
        },
      )
    }
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error updating research update' },
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
  let images: DBMedia[] = []

  if (idsToKeep.length > 0) {
    const existingMedia = await client
      .from('research_updates')
      .select('images')
      .eq('id', updateId)
      .single()

    if (existingMedia.data && existingMedia.data.images?.length > 0) {
      images = existingMedia.data.images.filter((x) => idsToKeep.includes(x.id))
    }
  }

  if (newUploads.length > 0) {
    // TODO:remove unused images from storage
    const result = await storageServiceServer.uploadImage(
      newUploads,
      path,
      client,
    )

    if (result) {
      images = [...images, ...result.media]
    }
  }

  if (images && images.length > 0) {
    await client
      .from('research_updates')
      .update({ images })
      .eq('id', updateId)
      .select()
  }
}

async function updateOrReplaceFile(
  idsToKeep: string[],
  newUploads: File[],
  updateId: number,
  path: string,
  client: SupabaseClient,
) {
  const existingMedia = await client
    .from('research_updates')
    .select('files')
    .eq('id', updateId)
    .single()

  let media: MediaFile[] = []
  let mediaToRemove: MediaFile[] = []

  if (existingMedia.data && existingMedia.data.files?.length > 0) {
    media = existingMedia.data.files.filter((x) => idsToKeep.includes(x.id))
    mediaToRemove = existingMedia.data.files.filter(
      (x) => !idsToKeep.includes(x.id),
    )
  }

  if (mediaToRemove.length > 0) {
    await storageServiceServer.removeFiles(
      mediaToRemove.map((x) => `${path}/${x.name}`),
      client,
    )
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

  if (media && media.length > 0) {
    return await client
      .from('research_updates')
      .update({
        files: media,
      })
      .eq('id', updateId)
      .select()
  }
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

async function validateRequest(
  request: Request,
  user: User | null,
  data: any,
  profile: DBProfile | null,
  researchId: number,
  updateId: number,
  images: File[],
  client: SupabaseClient,
) {
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

  if (!profile) {
    return { status: 400, statusText: 'User not found' }
  }

  if (
    !researchServiceServer.isAllowedToEditUpdate(
      profile,
      researchId,
      updateId,
      client,
    )
  ) {
    return { status: 401, statusText: 'unauthorized to edit' }
  }

  const imageValidation = validateImages(images)
  if (!imageValidation.valid) {
    return {
      status: 400,
      statusText: imageValidation.errors.join(', '),
    }
  }

  return { valid: true }
}
