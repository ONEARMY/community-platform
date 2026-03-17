import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia, DBNews } from 'oa-shared';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { StorageServiceServer } from './storageService.server';

export class NewsServiceServer {
  constructor(private client: SupabaseClient) {}

  async getById(id: number) {
    const result = await this.client.from('news').select().eq('id', id).single();
    return result.data as DBNews;
  }

  getBySlug(slug: string) {
    return this.client
      .from('news')
      .select(
        `
       id,
       created_at,
       created_by,
       modified_at,
       published_at,
       comment_count,
       body,
       is_draft,
       moderation,
       slug,
       summary,
       category:category(id,name),
       profile_badge:profile_badge(*),
       tags,
       title,
       total_views,
       tenant_id,
       hero_image,
       author:profiles(id, display_name, username, country, badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url
          )
        ))
     `,
      )
      .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
      .or('deleted.eq.false,deleted.is.null')
      .single();
  }

  async getHeroImage(dbImage: DBMedia | null) {
    if (!dbImage) {
      return null;
    }

    const images = new StorageServiceServer(this.client).getPublicUrls(
      [dbImage],
      IMAGE_SIZES.GALLERY,
    );

    return images[0];
  }
}
