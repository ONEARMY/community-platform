import type { SupabaseClient } from '@supabase/supabase-js';
import {
  type DBProject,
  type DBProjectStep,
  Image,
  Project,
  ProjectStepDTO,
  UserRole,
} from 'oa-shared';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { ImageServiceServer } from './imageService.server';
import { StorageServiceServer } from './storageService.server';

export class LibraryServiceServer {
  constructor(private client: SupabaseClient) {}

  getBySlug(slug: string) {
    return this.client
      .from('projects')
      .select(
        `
        id,
        created_at,
        created_by,
        modified_at,
        published_at,
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
        author:profiles(id, display_name, username, photo, country, donations_enabled,
          profile_type(id, display_name, name, is_space, image_url, small_image_url),
          badges:profile_badges_relations(
            profile_badges(
              id,
              name,
              display_name,
              image_url,
              action_url
            )
          )
        ),
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
      .single();
  }

  async getUserProjects(username: string): Promise<Partial<Project>[]> {
    const imageService = new ImageServiceServer(this.client);
    const { data, error } = await this.client.rpc('get_user_projects', {
      username_param: username,
    });

    if (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }

    return data?.map((x) => {
      const coverImage = x.cover_image ? imageService.getPublicUrl(x.cover_image) : null;

      return {
        id: x.id,
        commentCount: x.comment_count,
        coverImage,
        title: x.title,
        slug: x.slug,
        usefulCount: x.total_useful,
      };
    });
  }

  getProjectPublicMedia(projectDb: DBProject) {
    const allImages: Image[] = [];

    const storage = new StorageServiceServer(this.client);
    if (projectDb.cover_image) {
      const coverImage = storage
        .getPublicUrls([projectDb.cover_image], IMAGE_SIZES.LANDSCAPE)
        ?.at(0);

      if (coverImage) {
        allImages.push(coverImage);
      }
    }

    const stepImages = projectDb.steps?.flatMap((x) => x.images)?.filter((x) => !!x) || [];

    const publicStepImages = stepImages
      ? storage.getPublicUrls(stepImages, IMAGE_SIZES.GALLERY)
      : [];

    return [...allImages, ...publicStepImages.filter((x) => !!x)];
  }

  async isAllowedToEditProject(
    project: DBProject,
    profile: { id: number; username: string | null; roles: string[] | null },
  ) {
    if (profile.id === project.author?.id) {
      return true;
    }

    return profile.roles?.includes(UserRole.ADMIN);
  }

  async isAllowedToEditProjectById(
    id: number,
    profile: { id: number; username: string | null; roles: string[] | null },
  ) {
    const projectResult = await this.client
      .from('projects')
      .select('id,created_by,author:profiles(id,username)')
      .eq('id', id)
      .single();

    const project = projectResult.data as unknown as DBProject;

    return this.isAllowedToEditProject(project, profile);
  }

  async getById(id: number) {
    const result = await this.client.from('projects').select().eq('id', id).single();
    return result.data as DBProject;
  }

  async getProjectStepIds(id: number): Promise<number[]> {
    const result = await this.client.from('project_steps').select('id').eq('project_id', id);

    return result.data?.map((x) => x.id) as number[];
  }

  async upsertStep(
    projectId: number,
    stepId: number | null,
    values: ProjectStepDTO,
    order: number,
  ) {
    if (stepId) {
      const { data, error } = await this.client
        .from('project_steps')
        .update({
          title: values.title,
          description: values.description,
          project_id: projectId,
          video_url: values.videoUrl,
          images: values.images,
          order,
        })
        .eq('id', stepId)
        .select();
      if (error || !data) {
        throw error;
      }
      return data[0] as unknown as DBProjectStep;
    } else {
      const { data, error } = await this.client
        .from('project_steps')
        .insert({
          title: values.title,
          description: values.description,
          project_id: projectId,
          video_url: values.videoUrl,
          images: values.images,
          tenant_id: process.env.TENANT_ID,
          order,
        })
        .select();
      if (error || !data) {
        throw error;
      }
      return data[0] as unknown as DBProjectStep;
    }
  }

  async deleteStepsById(ids: number[]) {
    await this.client.from('project_steps').delete().in('id', ids);
  }
}
