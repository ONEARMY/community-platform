import type { SupabaseClient } from '@supabase/supabase-js';
import { Tag } from 'oa-shared';

export class TagsServiceServer {
  constructor(private client: SupabaseClient) {}

  async getTags(tagIds: number[]) {
    let tags: Tag[] = [];

    if (tagIds?.length > 0) {
      const tagsResult = await this.client
        .from('tags')
        .select('id,name,created_at,modified_at')
        .in('id', tagIds);

      if (tagsResult.data) {
        tags = tagsResult.data.map((x) => Tag.fromDB(x));
      }
    }

    return tags;
  }
}
