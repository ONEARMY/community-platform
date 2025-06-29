import { Project, ProjectStep } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { libraryServiceServer } from 'src/services/libraryService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { convertToSlug } from 'src/utils/slug'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBMedia, DBProject, MediaFile, Moderation } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = Number(params.id)

    if (request.method === 'DELETE') {
      return await deleteProject(request, id)
    }

    const formData = await request.formData()

    const uploadedCoverImage = formData.get('coverImage') as File | null
    const uploadedFiles = formData.getAll('files') as File[] | null
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      isDraft: formData.get('draft') === 'true',
      time: formData.get('time') as string,
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      fileLink: formData.has('fileLink')
        ? (formData.get('fileLink') as string)
        : null,
      difficultyLevel: formData.has('difficultyLevel')
        ? (formData.get('difficultyLevel') as string)
        : null,
      stepCount: parseInt(formData.get('stepCount') as string),
    }
    const existingCoverImageId = formData.get('existingCoverImage') as string
    const filesToKeepIds = formData.getAll('existingFiles') as string[]

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

    const profile = await profileServiceServer.getByAuthId(user!.id, client)
    const currentProject = await libraryServiceServer.getById(id, client)

    const slug = convertToSlug(data.title)

    if (
      currentProject.slug !== slug &&
      (await contentServiceServer.isDuplicateNewSlug(slug, client, 'projects'))
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This project already exists',
        },
      )
    }

    if (!profile) {
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    // 1. Upload files
    if (!existingCoverImageId && currentProject.cover_image?.id) {
      // remove existing
      await storageServiceServer.removeImages(
        [currentProject.cover_image.path],
        client,
      )
    }

    let newCoverImage: DBMedia | undefined = undefined
    if (uploadedCoverImage) {
      const mediaResult = await storageServiceServer.uploadImage(
        [uploadedCoverImage],
        `projects/${currentProject.id}`,
        client,
      )
      newCoverImage = mediaResult?.media[0]
    }

    const files = uploadedFiles
      ? await updateOrReplaceFile(
          filesToKeepIds,
          uploadedFiles,
          currentProject,
          `projects/${id}`,
          client,
        )
      : null

    // 2. Update project
    const projectDb = await updateProject(
      client,
      currentProject,
      data,
      slug,
      files,
      newCoverImage,
      existingCoverImageId,
    )
    const project = Project.fromDB(projectDb, [])
    const existingStepIds = await libraryServiceServer.getProjectStepIds(
      projectDb.id,
      client,
    )

    // 3. Upsert Steps
    const stepsToKeepIds: number[] = []

    for (let i = 0; i < data.stepCount; i++) {
      const stepId = formData.has(`steps.[${i}].id`)
        ? Number(formData.get(`steps.[${i}].id`))
        : null
      if (stepId) {
        stepsToKeepIds.push(+stepId)
      }

      const newImages = formData.getAll(`steps.[${i}].images`) as File[]
      const existingImagesIds = formData.getAll(
        `steps.[${i}].existingImages`,
      ) as string[]

      const stepDb = await libraryServiceServer.upsertStep(client, stepId, {
        title: formData.get(`steps.[${i}].title`) as string,
        description: formData.get(`steps.[${i}].description`) as string,
        videoUrl: (formData.get(`steps.[${i}].videoUrl`) as string) || null,
        projectId: projectDb.id,
        order: i + 1,
      })
      const step = ProjectStep.fromDB(stepDb)

      // 4. Upload and set images of each Step
      const images = await updateOrReplaceImages(
        existingImagesIds,
        newImages,
        stepDb.id,
        `projects/${id}`,
        client,
      )

      const { data } = await client
        .from('project_steps')
        .update({ images })
        .eq('id', stepDb.id)
        .select('images')
        .single()
      step.images = data?.images
      project.steps.push(step)
    }

    // delete steps
    const stepsToDelete = existingStepIds.filter(
      (id) => !stepsToKeepIds.includes(id),
    )
    if (stepsToDelete.length > 0) {
      await libraryServiceServer.deleteStepsById([...stepsToDelete], client)
    }

    return Response.json({ project }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating project' },
    )
  }
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

  if (!data.isDraft && (!data.stepCount || data.stepCount < 3)) {
    return { status: 400, statusText: '3 steps are required' }
  }

  return { valid: true }
}

async function updateProject(
  client: SupabaseClient,
  currentProject: DBProject,
  data: {
    title: string
    description: string
    isDraft: boolean
    category: string | null
    tags: number[] | null
    fileLink: string | null
    difficultyLevel: string | null
    time: string | null
    moderation?: Moderation
  },
  slug: string,
  files: MediaFile[] | null,
  coverImage?: DBMedia,
  existingCoverImageId?: string,
) {
  const previousSlugs = currentProject.previous_slugs || []

  if (currentProject.slug !== slug) {
    previousSlugs.push(currentProject.slug)
  }

  let cover_image: DBMedia | null = null

  if (coverImage) {
    cover_image = coverImage
  } else if (existingCoverImageId) {
    cover_image = currentProject.cover_image
  }

  const projectResult = await client
    .from('projects')
    .update({
      title: data.title,
      description: data.description,
      slug,
      previous_slugs: previousSlugs,
      category: data.category,
      tags: data.tags,
      is_draft: data.isDraft,
      file_link: data.fileLink,
      difficulty_level: data.difficultyLevel,
      time: data.time,
      files,
      cover_image,
    })
    .eq('id', currentProject.id)
    .select()

  if (projectResult.error || !projectResult.data) {
    throw projectResult.error
  }

  return projectResult.data[0] as unknown as DBProject
}

async function updateOrReplaceImages(
  idsToKeep: string[],
  newUploads: File[],
  stepId: number,
  path: string,
  client: SupabaseClient,
) {
  let media: DBMedia[] = []

  if (idsToKeep.length > 0) {
    const existingMedia = await client
      .from('project_steps')
      .select('images')
      .eq('id', stepId)
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
async function deleteProject(request: Request, id: number) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  const canEdit = await libraryServiceServer.isAllowedToEditProjectById(
    client,
    id,
    user?.user_metadata.username,
  )

  if (canEdit) {
    await client
      .from('projects')
      .update({
        deleted: true,
      })
      .eq('id', id)

    return Response.json({}, { status: 200, headers })
  }

  return Response.json({}, { status: 500, headers })
}

async function updateOrReplaceFile(
  idsToKeep: string[],
  newUploads: File[],
  currentProject: DBProject,
  path: string,
  client: SupabaseClient,
) {
  const existingFiles = currentProject.files

  let media: MediaFile[] = []
  let mediaToRemove: MediaFile[] = []

  if (existingFiles && existingFiles.length > 0) {
    media = existingFiles.filter((x) => idsToKeep.includes(x.id))
    mediaToRemove = existingFiles.filter((x) => !idsToKeep.includes(x.id))
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

  return media
}
