import { Project, UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'

import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProject } from 'oa-shared'

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
        moderation,
        author:profiles(id, display_name, username, is_verified, is_supporter, country),
        steps:project_steps(
          id, 
          created_at, 
          title, 
          description, 
          images, 
          video_url
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
  const result = await client
    .from('projects')
    .select('id, title, slug, total_useful, profiles!inner(username)')
    .eq('profiles.username', username)
    .or('deleted.eq.false, deleted.is.null')

  if (result.error) {
    return []
  }

  return result.data?.map((x) => ({
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
  const result = await client.from('project').select().eq('id', id).single()
  return result.data as DBProject
}

export const libraryServiceServer = {
  getBySlug,
  getById,
  getUserProjects,
  getProjectPublicMedia,
  isAllowedToEditProject,
  isAllowedToEditProjectById,
}
