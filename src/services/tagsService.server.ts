import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBTag } from 'oa-shared';
import { Tag } from 'oa-shared';

export interface TagInput {
  name: string;
}

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

  async isDuplicateName(name: string, excludeId?: number) {
    let query = this.client.from('tags').select('id').eq('name', name);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const result = await query.limit(1);

    if (result.error) {
      throw result.error;
    }

    return !!result.data?.length;
  }

  async create(data: TagInput) {
    const result = await this.client
      .from('tags')
      .insert({
        name: data.name,
        tenant_id: process.env.TENANT_ID,
      })
      .select('id,name,created_at,modified_at')
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    return Tag.fromDB(result.data as DBTag);
  }

  async update(id: number, data: TagInput) {
    const result = await this.client
      .from('tags')
      .update({
        name: data.name,
      })
      .eq('id', id)
      .select('id,name,created_at,modified_at')
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    return Tag.fromDB(result.data as DBTag);
  }
}
