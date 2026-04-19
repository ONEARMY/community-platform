import type { SupabaseClient } from '@supabase/supabase-js';
import {
  Author,
  DBAuthor,
  DBProfile,
  DBResearchItem,
  DBResearchUpdate,
  ResearchItem,
  UserRole,
} from 'oa-shared';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { ImageServiceServer } from './imageService.server';
import { ProfileServiceServer } from './profileService.server';
import { StorageServiceServer } from './storageService.server';

export class ResearchServiceServer {
  constructor(private client: SupabaseClient) {}

  async getBySlug(slug: string) {
    const { data, error } = await this.client
      .from('research')
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
       image,
       category:category(id,name),
       tags,
       total_views,
       status,
       is_draft,
       collaborators,
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
        )),
       updates:research_updates(
        id,
        created_at,
        modified_at,
        published_at,
        title,
        description,
        images,
        files,
        file_link,
        file_download_count,
        video_url,
        is_draft,
        comment_count,
        deleted,
        update_author:profiles(id, display_name, username, photo, country, badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url
          )
        ))
      )
     `,
      )
      .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
      .or('deleted.eq.false,deleted.is.null')
      .single();

    if (!data || error) {
      return { error };
    }

    const item = data as unknown as DBResearchItem;
    let collaborators: Author[] | undefined = [];

    if (item?.collaborators?.length) {
      // potential improvement: could make an rpc query for the whole research + collaborators instead of 2 queries
      collaborators = await this.getCollaborators(item.collaborators);
    }

    return { item, collaborators, error };
  }

  private async getCollaborators(collaboratorIds: string[] | null) {
    if (collaboratorIds === null || collaboratorIds.length === 0) {
      return [];
    }

    const profileService = new ProfileServiceServer(this.client);
    const users = await profileService.getUsersByUsername(collaboratorIds);

    return users?.map((user) => Author.fromDB(user as unknown as DBAuthor)) || [];
  }

  async getUpdate(researchId: number, updateId: number) {
    return this.client
      .from('research_updates')
      .select(
        'id, research_id, created_at, modified_at, published_at, title, description, images, file_ids, file_link, video_url, is_draft, comment_count, deleted',
      )
      .eq('id', updateId)
      .eq('research_id', researchId)
      .single();
  }

  async getUserResearch(username: string): Promise<Partial<ResearchItem>[]> {
    const imageService = new ImageServiceServer(this.client);
    const { data, error } = await this.client.rpc('get_user_research', {
      username_param: username,
    });

    if (error) {
      console.error('Error fetching user research:', error);
      return [];
    }

    return data?.map((x) => {
      const image = x.image ? imageService.getPublicUrl(x.image) : null;
      return {
        id: x.id,
        // commentCount: x.comment_count,
        image,
        title: x.title,
        slug: x.slug,
        usefulCount: x.total_useful,
      };
    });
  }

  getResearchPublicMedia(researchDb: DBResearchItem) {
    const allImages = researchDb.updates?.flatMap((x) => x.images)?.filter((x) => !!x) || [];
    if (researchDb.image) {
      allImages.push(researchDb.image);
    }

    return allImages
      ? new StorageServiceServer(this.client).getPublicUrls(allImages, IMAGE_SIZES.LANDSCAPE)
      : [];
  }

  async isAllowedToEditResearch(research: DBResearchItem, profile: DBProfile) {
    if (profile.id === research.author?.id) {
      return true;
    }

    if (
      profile.username &&
      Array.isArray(research.collaborators) &&
      research.collaborators.includes(profile.username)
    ) {
      return true;
    }

    return profile.roles?.includes(UserRole.ADMIN);
  }

  async isAllowedToEditResearchById(id: number, profile: DBProfile) {
    const researchResult = await this.client
      .from('research')
      .select('id,created_by,collaborators,author:profiles(id,username)')
      .eq('id', id)
      .single();

    const research = researchResult.data as unknown as DBResearchItem;

    return this.isAllowedToEditResearch(research, profile);
  }

  async getById(id: number) {
    const result = await this.client.from('research').select().eq('id', id).single();
    return result.data as DBResearchItem;
  }

  async getUpdateById(id: number) {
    const result = await this.client.from('research_updates').select().eq('id', id).single();
    return result.data as DBResearchUpdate;
  }

  async isAllowedToEditUpdate(profile: DBProfile | null, researchId: number, updateId: number) {
    const research = await this.getById(researchId);
    const researchUpdate = await this.getUpdateById(updateId);

    if (research.id !== researchUpdate.research_id) {
      return false;
    }

    return (
      profile &&
      (profile.id === research.author?.id ||
        (profile.username && research.collaborators?.includes(profile.username)) ||
        profile?.roles?.includes(UserRole.ADMIN))
    );
  }
}
