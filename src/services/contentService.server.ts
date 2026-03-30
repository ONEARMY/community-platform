import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentType, IDBContentDoc } from 'oa-shared';
import { TagsServiceServer } from 'src/services/tagsService.server';

type Slug = string;
type Id = number;

export class ContentServiceServer {
  constructor(private client: SupabaseClient) {}

  async getDraftCount(profileId: number, table: ContentType) {
    const { count } = await this.client
      .from(table)
      .select('id', { count: 'exact' })
      .eq('is_draft', true)
      .eq('created_by', profileId)
      .or('deleted.eq.false,deleted.is.null');

    return count;
  }

  async getMetaFields(id: Id, table: ContentType, tagIds: number[]) {
    return await Promise.all([
      this.client
        .from('useful_votes')
        .select('*', { count: 'exact' })
        .eq('content_id', id)
        .eq('content_type', table),
      this.client
        .from('subscribers')
        .select('user_id', { count: 'exact' })
        .eq('content_id', id)
        .eq('content_type', table),
      new TagsServiceServer(this.client).getTags(tagIds),
    ]);
  }

  async incrementViewCount(table: ContentType, totalViews: number | undefined, id: Id) {
    return await this.client
      .from(table)
      .update({ total_views: (totalViews || 0) + 1 })
      .eq('id', id);
  }

  async isDuplicateExistingSlug(slug: Slug, id: Id, table: ContentType) {
    const { data } = await this.client
      .from(table)
      .select('id,slug,previous_slugs')
      .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
      .single();

    return !!data?.id && data.id !== id;
  }

  async isDuplicateNewSlug(slug: Slug, table: ContentType) {
    const { data } = await this.client
      .from(table)
      .select('slug,previous_slugs')
      .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
      .single();

    return !!data;
  }

  static async updatePreviousSlugs(content: IDBContentDoc, newSlug: Slug) {
    if (content.slug !== newSlug) {
      return content.previous_slugs ? [...content.previous_slugs, content.slug] : [content.slug];
    }

    return content.previous_slugs;
  }
}
