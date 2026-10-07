import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import type { DBProfileBadge } from 'oa-shared';
import { ProfileBadge } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';
import type { AdminProfileBadge, ProfileBadgeInput } from 'src/utils/profileBadges';

export const profileBadgesCache = new Keyv<ProfileBadge[]>({ ttl: 3600000 }); // ttl: 60 minutes

const toDB = (input: ProfileBadgeInput) => ({
  display_name: input.displayName,
  image_url: input.imageUrl,
  action_url: input.actionUrl,
  is_audience: input.isAudience,
  grants_badge_id: input.grantsBadgeId,
  available_to: input.availableTo,
  action_label: input.actionLabel,
});

const firstCount = (value: unknown) => (value as { count: number }[] | null)?.[0]?.count ?? 0;

export class ProfileBadgeServiceServer {
  constructor(private client: SupabaseClient) {}

  async getAll() {
    const cachedProfileBadges = await profileBadgesCache.get('profileBadges');

    if (cachedProfileBadges?.length && isProductionEnvironment()) {
      return cachedProfileBadges;
    }

    const { data } = await this.client.from('profile_badges').select('*');
    const profileBadges = (data || []).map((badge) => ProfileBadge.fromDB(badge as DBProfileBadge));

    if (profileBadges.length) {
      await profileBadgesCache.set('profileBadges', profileBadges);
    }

    return profileBadges;
  }

  async getAllWithUsage(): Promise<AdminProfileBadge[]> {
    const { data, error } = await this.client
      .from('profile_badges')
      .select(
        '*, holders:profile_badges_relations(count), articles:news_badges_relations(count), stripe_products:stripe_badge_products(count), stripe_tiers:stripe_tier_config(count)',
      )
      .order('id');

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      badge: ProfileBadge.fromDB(row as DBProfileBadge),
      usage: {
        holders: firstCount(row.holders),
        articles: firstCount(row.articles),
        stripeLinked: firstCount(row.stripe_products) + firstCount(row.stripe_tiers) > 0,
      },
    }));
  }

  async areAudience(ids: number[]) {
    const uniqueIds = [...new Set(ids)];

    if (!uniqueIds.length) {
      return true;
    }

    const { count, error } = await this.client
      .from('profile_badges')
      .select('id', { count: 'exact', head: true })
      .in('id', uniqueIds)
      .eq('is_audience', true);

    if (error) {
      throw error;
    }

    return count === uniqueIds.length;
  }

  async create(input: ProfileBadgeInput) {
    const result = await this.client
      .from('profile_badges')
      .insert({ ...toDB(input), name: input.name, tenant_id: process.env.TENANT_ID })
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await profileBadgesCache.delete('profileBadges');

    return ProfileBadge.fromDB(result.data as DBProfileBadge);
  }

  async update(id: number, input: ProfileBadgeInput) {
    const result = await this.client
      .from('profile_badges')
      .update(toDB(input))
      .eq('id', id)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error;
    }

    await profileBadgesCache.delete('profileBadges');

    return ProfileBadge.fromDB(result.data as DBProfileBadge);
  }

  async delete(id: number) {
    const result = await this.client.from('profile_badges').delete().eq('id', id);

    if (result.error) {
      throw result.error;
    }

    await profileBadgesCache.delete('profileBadges');
  }
}
