import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import type { ContentType, DBCategory } from 'oa-shared';
import { Category } from 'oa-shared';

export const categoriesCache = new Keyv<Category[]>({ ttl: 3600000 }); // ttl: 60 minutes

export interface CategoryInput {
  name: string;
  type: ContentType;
  description: string | null;
  imageUrl: string | null;
}

export class CategoryServiceServer {
  constructor(private client: SupabaseClient) {}

  async create(data: CategoryInput) {
    const result = await this.client
      .from('categories')
      .insert({
        name: data.name,
        type: data.type,
        description: data.description,
        image_url: data.imageUrl,
        tenant_id: process.env.TENANT_ID,
      })
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await categoriesCache.delete('categories');

    return Category.fromDB(result.data as DBCategory);
  }

  async update(id: number, data: CategoryInput) {
    const result = await this.client
      .from('categories')
      .update({
        name: data.name,
        type: data.type,
        description: data.description,
        image_url: data.imageUrl,
      })
      .eq('id', id)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await categoriesCache.delete('categories');

    return Category.fromDB(result.data as DBCategory);
  }

  async delete(id: number) {
    const result = await this.client.from('categories').delete().eq('id', id);

    if (result.error) {
      throw result.error;
    }

    await categoriesCache.delete('categories');
  }
}
