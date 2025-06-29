import { Project, UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'

import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProject, DBProjectStep } from 'oa-shared'

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
    .from('projects')
    .select(
      `
        id,
        created_at,
        created_by,
        modified_at,
        title,
        description,
        slug,
        cover_image,
        category:categories(id,name),
        tags,
        total_views,
        is_draft,
        files, 
        file_link, 
        file_download_count,
        time,
        difficulty_level,
        comment_count,
        moderation,
        moderation_feedback,
        author:profiles(id, display_name, username, is_verified, is_supporter, country),
        steps:project_steps(
          id, 
          created_at, 
          title, 
          description, 
          images, 
          video_url,
          order
        )
     `,
    )
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .or('deleted.eq.false,deleted.is.null')
    .single()
}

const getUserProjects = async (
  client: SupabaseClient,
  username: string,
): Promise<Partial<Project>[]> => {
  const { data, error } = await client.rpc('get_user_projects', {
    username_param: username,
  })

  if (error) {
    console.error('Error fetching user projects:', error)
    return []
  }

  return data?.map((x) => ({
    id: x.id,
    title: x.title,
    slug: x.slug,
    usefulCount: x.total_useful,
  }))
}

const getProjectPublicMedia = (
  projectDb: DBProject,
  client: SupabaseClient,
) => {
  const allImages =
    projectDb.steps?.flatMap((x) => x.images)?.filter((x) => !!x) || []
  if (projectDb.cover_image) {
    allImages.push(projectDb.cover_image)
  }

  return allImages
    ? storageServiceServer.getPublicUrls(client, allImages, IMAGE_SIZES.GALLERY)
    : []
}

const isAllowedToEditProject = async (
  client: SupabaseClient,
  authorUsername: string,
  currentUsername: string,
) => {
  if (!currentUsername) {
    return false
  }

  if (currentUsername === authorUsername) {
    return true
  }

  const { data } = await client
    .from('profiles')
    .select('roles')
    .eq('username', currentUsername)

  return data?.at(0)?.roles?.includes(UserRole.ADMIN)
}

const isAllowedToEditProjectById = async (
  client: SupabaseClient,
  id: number,
  currentUsername: string,
) => {
  const projectResult = await client
    .from('projects')
    .select('id,created_by')
    .eq('id', id)
    .single()

  const project = projectResult.data as unknown as DBProject

  const item = Project.fromDB(project, [])

  return isAllowedToEditProject(
    client,
    item.author?.username || '',
    currentUsername,
  )
}

async function getById(id: number, client: SupabaseClient) {
  const result = await client.from('projects').select().eq('id', id).single()
  return result.data as DBProject
}

async function getProjectStepIds(
  id: number,
  client: SupabaseClient,
): Promise<number[]> {
  const result = await client
    .from('project_steps')
    .select('id')
    .eq('project_id', id)

  return result.data?.map((x) => x.id) as number[]
}

async function upsertStep(
  client: SupabaseClient,
  stepId: number | null,
  values: {
    title: string
    description: string
    projectId: number
    videoUrl: string | null
    order: number
  },
) {
  if (stepId) {
    const { data, error } = await client
      .from('project_steps')
      .update({
        title: values.title,
        description: values.description,
        project_id: values.projectId,
        video_url: values.videoUrl,
        order: values.order,
      })
      .eq('id', stepId)
      .select()
    if (error || !data) {
      throw error
    }
    return data[0] as unknown as DBProjectStep
  } else {
    const { data, error } = await client
      .from('project_steps')
      .insert({
        title: values.title,
        description: values.description,
        project_id: values.projectId,
        video_url: values.videoUrl,
        order: values.order,
        tenant_id: process.env.TENANT_ID,
      })
      .select()
    if (error || !data) {
      throw error
    }
    return data[0] as unknown as DBProjectStep
  }
}

async function deleteStepsById(ids: number[], client: SupabaseClient) {
  await client.from('project_steps').delete().in('id', ids)
}

export const libraryServiceServer = {
  getBySlug,
  getById,
  getUserProjects,
  getProjectPublicMedia,
  isAllowedToEditProject,
  isAllowedToEditProjectById,
  upsertStep,
  getProjectStepIds,
  deleteStepsById,
}
