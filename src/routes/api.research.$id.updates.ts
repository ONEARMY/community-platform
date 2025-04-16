import { ResearchUpdate } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const researchId = Number(params.id)
    const formData = await request.formData()
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

    const profile = await profileServiceServer.getByAuthId(user!.id, client)

    if (!profile) {
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const updateResult = await client
      .from('research_updates')
      .insert({
        title: data.title,
        description: data.description,
        is_draft: data.isDraft,
        research_id: researchId,
        created_by: profile.id,
        tenant_id: process.env.TENANT_ID,
      })
      .select()

    if (updateResult.error || !updateResult.data) {
      throw updateResult.error
    }

    const researchUpdate = ResearchUpdate.fromDB(updateResult.data[0], [])

    await uploadAndUpdateImages(
      uploadedImages,
      `research/${researchId}/updates/${researchUpdate.id}`,
      researchUpdate,
      client,
    )

    await uploadAndUpdateFiles(
      uploadedFiles,
      `research/${researchId}/updates/${researchUpdate.id}`,
      researchUpdate,
      client,
    )

    return Response.json({ researchUpdate }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function uploadAndUpdateImages(
  files: File[],
  path: string,
  researchUpdate: ResearchUpdate,
  client: SupabaseClient,
) {
  if (files.length > 0) {
    const mediaResult = await storageServiceServer.uploadImage(
      files,
      path,
      client,
    )

    if (mediaResult?.media && mediaResult.media.length > 0) {
      const result = await client
        .from('research_updates')
        .update({
          images: mediaResult.media,
        })
        .eq('id', researchUpdate.id)
        .select()

      if (result.data) {
        researchUpdate.images = result.data[0].images
      }
    }
  }
}

async function uploadAndUpdateFiles(
  files: File[],
  path: string,
  researchUpdate: ResearchUpdate,
  client: SupabaseClient,
) {
  if (files.length > 0) {
    const mediaResult = await storageServiceServer.uploadFile(
      files,
      path,
      client,
    )

    if (mediaResult?.media && mediaResult.media.length > 0) {
      const result = await client
        .from('research_updates')
        .update({
          files: mediaResult.media,
        })
        .eq('id', researchUpdate.id)
        .select()

      if (result.data) {
        researchUpdate.files = result.data[0].files
      }
    }
  }
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
