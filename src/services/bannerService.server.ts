import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import type { DBBanner } from 'oa-shared';
import { Banner } from 'oa-shared';

export const bannerCache = new Keyv<Banner>({ ttl: 86400000 }); // ttl: 24 hours

export interface BannerInput {
  text: string;
  url: string | null;
}

export class BannerServiceServer {
  constructor(private client: SupabaseClient) {}

  async create(data: BannerInput) {
    const result = await this.client
      .from('banners')
      .insert({
        text: data.text,
        url: data.url,
        tenant_id: process.env.TENANT_ID,
      })
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await bannerCache.delete('banner');

    return Banner.fromDB(result.data as DBBanner);
  }

  async update(id: number, data: BannerInput) {
    const result = await this.client
      .from('banners')
      .update({
        text: data.text,
        url: data.url,
      })
      .eq('id', id)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await bannerCache.delete('banner');

    return Banner.fromDB(result.data as DBBanner);
  }

  async delete(id: number) {
    const result = await this.client.from('banners').delete().eq('id', id);

    if (result.error) {
      throw result.error;
    }

    await bannerCache.delete('banner');
  }
}
