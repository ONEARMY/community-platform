import { ResearchUpdate, UserRole } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { broadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBProfile, DBResearchItem } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const { client, headers } = createSupabaseServerClient(request)

    const researchId = Number(params.id)
    const formData = await request.formData()

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      videoUrl: formData.get('videoUrl') as string,
      fileUrl: formData.get('fileUrl') as string,
      isDraft: formData.get('draft') === 'true',
    }
    const uploadedImages = formData.getAll('images') as File[]
    const uploadedFiles = formData.getAll('files') as File[]
    const userData = await client.auth.getUser()
    const profile = await profileServiceServer.getByAuthId(
      userData.data.user!.id,
      client,
    )

    const researchResult = await client
      .from('research')
      .select('id,title,slug,collaborators,author:profiles(id, username)')
      .eq('id', researchId)
      .single()
    const research = researchResult.data as unknown as DBResearchItem

    const { valid, status, statusText } = validateRequest(
      request,
      userData.data.user,
      data,
      research,
      profile,
      uploadedImages,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const updateResult = await client
      .from('research_updates')
      .insert({
        title: data.title,
        description: data.description,
        video_url: data.videoUrl,
        is_draft: data.isDraft,
        research_id: researchId,
        created_by: profile!.id,
        tenant_id: process.env.TENANT_ID,
      })
      .select('*,research:research(id,collaborators,created_by,is_draft,slug)')
      .single()

    if (updateResult.error || !updateResult.data) {
      throw updateResult.error
    }

    const dbResearchUpdate = updateResult.data
    const researchUpdate = ResearchUpdate.fromDB(dbResearchUpdate, [])
    researchUpdate.research = updateResult.data.research

    try {
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

      await subscribersServiceServer.addResearchUpdateSubscribers(
        researchUpdate,
        profile!.id,
        client,
      )

      broadcastCoordinationServiceServer.researchUpdate(
        researchUpdate,
        profile,
        client,
        request,
      )

      return Response.json({ researchUpdate }, { headers, status: 201 })
    } catch (error) {
      console.error(error)

      await client.from('research_updates').delete().eq('id', researchUpdate.id)

      return Response.json(
        {},
        {
          status: 500,
          statusText: 'Error after trying to create research update',
        },
      )
    }
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research update' },
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
    const imagesResult = await storageServiceServer.uploadImage(
      files,
      path,
      client,
    )

    if (imagesResult?.media && imagesResult.media.length > 0) {
      return await client
        .from('research_updates')
        .update({ images: imagesResult.media })
        .eq('id', researchUpdate.id)
        .select()
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
      return await client
        .from('research_updates')
        .update({
          files: mediaResult.media,
        })
        .eq('id', researchUpdate.id)
        .select()
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

function validateRequest(
  request: Request,
  user: User | null,
  data: any,
  research: DBResearchItem | null,
  profile: DBProfile | null,
  images: File[],
) {
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

  if (!research) {
    return { status: 400, statusText: 'Research not found' }
  }

  if (!profile) {
    return { status: 400, statusText: 'User not found' }
  }

  if (
    profile.id !== research.author?.id &&
    !research.collaborators?.includes(profile.username) &&
    !profile.roles?.includes(UserRole.ADMIN)
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
