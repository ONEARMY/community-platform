import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import { DBProfileType, ProfileType } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

const cache = new Keyv<ProfileType[]>({ ttl: 3600000 }); // ttl: 60 minutes

export interface ProfileTypeInput {
  name: string;
  order: number;
  displayName: string;
  description: string | null;
  imageUrl: string | null;
  smallImageUrl: string | null;
  mapPinName: string | null;
  isSpace: boolean;
}

export class ProfileTypesServiceServer {
  constructor(private client: SupabaseClient) {}

  async getById(id: number): Promise<DBProfileType> {
    const result = await this.client.from('questions').select().eq('id', id).single();
    return result.data as DBProfileType;
  }

  async get(cached = true) {
    if (cached) {
      const cachedProfileTypes = await cache.get('profile-types');

      if (
        cachedProfileTypes &&
        Array.isArray(cachedProfileTypes) &&
        cachedProfileTypes.length &&
        isProductionEnvironment()
      ) {
        return cachedProfileTypes;
      }
    }

    const profileTypesResult = await this.client.from('profile_types').select(`
      id,
      name,
      display_name,
      order,
      image_url,
      small_image_url,
      description,
      map_pin_name,
      is_space
      `);

    const dbProfileTypes = profileTypesResult.data || [];
    const profileTypes = dbProfileTypes.map((x) => ProfileType.fromDB(x));

    await cache.set('profile-types', profileTypes);

    return profileTypes;
  }

  async create(data: ProfileTypeInput) {
    const result = await this.client
      .from('profile_types')
      .insert({
        name: data.name.toLocaleLowerCase(),
        order: data.order,
        display_name: data.name,
        description: data.description,
        image_url: data.imageUrl,
        small_image_url: data.smallImageUrl,
        map_pin_name: data.mapPinName,
        is_space: data.isSpace,
        tenant_id: process.env.TENANT_ID,
      })
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await cache.delete('profile-types');

    return ProfileType.fromDB(result.data as DBProfileType);
  }

  async update(id: number, data: ProfileTypeInput) {
    const result = await this.client
      .from('profile_types')
      .update({
        name: data.name.toLocaleLowerCase(),
        display_name: data.name,
        description: data.description,
        image_url: data.imageUrl,
        small_image_url: data.smallImageUrl,
        map_pin_name: data.mapPinName,
        is_space: data.isSpace,
        tenant_id: process.env.TENANT_ID,
      })
      .eq('id', id)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await cache.delete('profile-types');

    return ProfileType.fromDB(result.data as DBProfileType);
  }

  async delete(id: number) {
    const result = await this.client.from('profile_types').delete().eq('id', id);

    if (result.error) {
      throw result.error;
    }

    await cache.delete('profile-types');
  }
}
