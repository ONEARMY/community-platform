import { Project, ProjectStep, UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { ITEMS_PER_PAGE } from 'src/pages/Library/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { convertToSlug } from 'src/utils/slug'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBProfile, DBProject, DBProjectStep, Moderation } from 'oa-shared'
import type { LibrarySortOption } from 'src/pages/Library/Content/List/LibrarySortOptions'

// runs on the server
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const q = searchParams.get('q')
  const category = Number(searchParams.get('category')) || undefined
  const sort = searchParams.get('sort') as LibrarySortOption
  const skip = Number(searchParams.get('skip')) || 0

  const { client, headers } = createSupabaseServerClient(request)

  const { data, error } = await client.rpc('get_projects', {
    search_query: q || null,
    category_id: category,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  })

  const countRersult = await client.rpc('get_projects_count', {
    search_query: q || null,
    category_id: category,
  })
  const count = countRersult.data || 0

  if (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }

  const dbItems = data as DBProject[]
  const items = dbItems.map((x) => {
    const images = x.cover_image
      ? storageServiceServer.getPublicUrls(
          client,
          [x.cover_image],
          IMAGE_SIZES.LIST,
        )
      : []
    return Project.fromDB(x, [], images)
  })

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'projects',
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

  return Response.json({ items, total: count }, { headers })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
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
      moderation: 'awaiting-moderation' as Moderation,
      stepCount: parseInt(formData.get('stepCount') as string),
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

    const profile = await profileServiceServer.getByAuthId(user!.id, client)

    if (profile?.roles?.includes(UserRole.ADMIN)) {
      data.moderation = 'accepted'
    }

    const slug = convertToSlug(data.title)

    if (
      await contentServiceServer.isDuplicateNewSlug(slug, client, 'projects')
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

    // 1. Create Project
    const projectDb = await createProject(client, data, profile, slug)
    const project = Project.fromDB(projectDb, [])

    // 2. Upload and set project files and cover image
    if (uploadedCoverImage) {
      const images = await uploadAndUpdateImage(
        [uploadedCoverImage],
        `projects/${project.id}`,
        'projects',
        'cover_image',
        project.id,
        client,
      )
      project.coverImage = images[0]
    }

    if (uploadedFiles) {
      await uploadAndUpdateFiles(
        uploadedFiles,
        `projects/${project.id}`,
        project,
        client,
      )
    }

    // 3. Create Steps
    for (let i = 0; i < data.stepCount; i++) {
      const images = formData.getAll(`steps.[${i}].images`) as File[]

      const stepDb = await createStep(client, {
        title: formData.get(`steps.[${i}].title`) as string,
        description: formData.get(`steps.[${i}].description`) as string,
        videoUrl: (formData.get(`steps.[${i}].videoUrl`) as string) || null,
        projectId: projectDb.id,
      })
      const step = ProjectStep.fromDB(stepDb)

      // 4. Upload and set images of each Step
      step.images = await uploadAndUpdateImage(
        images,
        `projects/${project.id}`,
        'project_steps',
        'images',
        step.id,
        client,
      )

      project.steps.push(step)
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

  if (request.method !== 'POST') {
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

async function createProject(
  client: SupabaseClient,
  data: {
    title: string
    description: string
    isDraft: boolean
    category: string | null
    tags: number[] | null
    fileLink: string | null
    difficultyLevel: string | null
    time: string | null
    moderation: Moderation
  },
  profile: DBProfile,
  slug: string,
) {
  const projectResult = await client
    .from('projects')
    .insert({
      created_by: profile.id,
      title: data.title,
      description: data.description,
      slug,
      category: data.category,
      tags: data.tags,
      is_draft: data.isDraft,
      file_link: data.fileLink,
      difficulty_level: data.difficultyLevel,
      time: data.time,
      moderation: data.moderation || 'awaiting-moderation',
      tenant_id: process.env.TENANT_ID,
    })
    .select()

  if (projectResult.error || !projectResult.data) {
    throw projectResult.error
  }

  return projectResult.data[0] as unknown as DBProject
}

async function createStep(
  client: SupabaseClient,
  values: {
    title: string
    description: string
    projectId: number
    videoUrl: string | null
  },
) {
  const { data, error } = await client
    .from('project_steps')
    .insert({
      title: values.title,
      description: values.description,
      project_id: values.projectId,
      video_url: values.videoUrl,
      tenant_id: process.env.TENANT_ID,
    })
    .select()

  if (error || !data) {
    throw error
  }

  return data[0] as unknown as DBProjectStep
}

async function uploadAndUpdateImage(
  files: File[],
  path: string,
  tableName: 'projects' | 'project_steps',
  fieldName: string,
  id: number,
  client: SupabaseClient,
) {
  const mediaResult = await storageServiceServer.uploadImage(
    files,
    path,
    client,
  )

  if (mediaResult?.media && mediaResult.media.length > 0) {
    const result = await client
      .from(tableName)
      .update({
        [fieldName]: mediaResult.media,
      })
      .eq('id', id)
      .select()

    if (result.data) {
      return result.data[0].images
    }
  }
}

async function uploadAndUpdateFiles(
  files: File[],
  path: string,
  project: Project,
  client: SupabaseClient,
) {
  const mediaResult = await storageServiceServer.uploadFile(files, path, client)

  if (mediaResult?.media && mediaResult.media.length > 0) {
    const result = await client
      .from('projects')
      .update({
        files: mediaResult.media,
      })
      .eq('id', project.id)
      .select()

    if (result.data) {
      project.files = result.data[0].files
    }
  }
}
