import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { DBAuthorVotes, DBProfile, ProfileDTO, ProfileType } from 'oa-shared';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import { ProfileTypesServiceServer } from './profileTypesService.server';

export class ProfileServiceServer {
  constructor(private client: SupabaseClient) {}

  async getByAuthId(id: string): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `*,
        badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url,
            premium_tier
          )
        ),
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url,
          description,
          map_pin_name,
          is_space
        )`,
      )
      .eq('auth_id', id)
      .single();

    if (!data) {
      return null;
    }

    return data as DBProfile;
  }

  async getById(id: number): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `*,
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url,
          description,
          map_pin_name,
          is_space
        ),
        pin:map_pins(
          id,
          moderation
        )`,
      )
      .eq('id', id)
      .single();

    if (!data) {
      return null;
    }

    return data as DBProfile;
  }

  async getUsersByUsername(usernames: string[]): Promise<DBProfile[] | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `id,
        username,
        display_name,
        photo,
        cover_images,
        country,
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        ),
        badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url,
            premium_tier
          )
        ),
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url,
          description,
          map_pin_name,
          is_space
        )`,
      )
      .in('username', usernames);

    if (!data) {
      return null;
    }

    return data as unknown as DBProfile[];
  }

  async getByUsername(username: string): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `*,
        badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url,
            premium_tier
          )
        ),
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        ),
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url,
          description,
          map_pin_name,
          is_space
        )`,
      )
      .eq('username', username)
      .single();

    if (!data) {
      return null;
    }

    return data as DBProfile;
  }

  async incrementViewCount(id: number, totalViews: number) {
    return await this.client
      .from('profiles')
      .update({ total_views: (totalViews || 0) + 1 })
      .eq('id', id);
  }

  async getAuthorUsefulVotes(id: number) {
    const { data, error } = await this.client.rpc('get_author_vote_counts', {
      author_id: id,
    });

    if (error || !data) {
      console.error(error);
      return null;
    }

    return data as DBAuthorVotes[];
  }

  async updateProfile(id: number, values: ProfileDTO) {
    const types = await new ProfileTypesServiceServer(this.client).get();
    const typeId = types.find((x) => x.name === values.type)!.id;
    const existingProfile = await this.getById(id);
    const pinModeration = this.determinePinModeration(types, existingProfile!, values.type);

    await this.updateTags(id, values.tagIds || []);

    const { data, error } = await this.client
      .from('profiles')
      .update({
        about: values.about,
        country: values.country,
        display_name: values.displayName,
        website: values.website,
        is_contactable: values.isContactable,
        profile_type: typeId,
        photo: values.photo,
        cover_images: values.coverImages,
        visitor_policy: values.visitorPreferencePolicy
          ? JSON.stringify({
              policy: values.visitorPreferencePolicy,
              details: values.visitorPreferenceDetails,
            })
          : null,
      })
      .eq('id', id)
      .select(
        `*,
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        ),
        badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url,
            premium_tier
          )
        )`,
      )
      .single();
    if (error) {
      throw error;
    }

    if (pinModeration) {
      await this.client.from('map_pins').update({ moderation: pinModeration }).eq('profile_id', id);
    }

    return new ProfileFactory(this.client).fromDB(data as unknown as DBProfile);
  }

  async updateTags(profileId: number, tagIds: number[]) {
    const { data } = await this.client
      .from('profile_tags_relations')
      .select('*')
      .eq('profile_id', profileId);

    // Determine which tags to add and remove
    const existingTagIds = data?.map((rel) => rel.profile_tag_id) || [];
    const tagsToAdd = tagIds.filter((tagId) => !existingTagIds.includes(tagId));
    const tagsToRemove = existingTagIds.filter((tagId) => !tagIds.includes(tagId));

    // Remove tags that are no longer needed
    if (tagsToRemove.length > 0) {
      const { error } = await this.client
        .from('profile_tags_relations')
        .delete()
        .eq('profile_id', profileId)
        .in('profile_tag_id', tagsToRemove);

      if (error) {
        console.error(error);
      }
    }

    // Add new tags
    if (tagsToAdd.length > 0) {
      const newRelations = tagsToAdd.map((tagId) => ({
        profile_id: profileId,
        profile_tag_id: tagId,
        tenant_id: process.env.TENANT_ID,
      }));

      const { error } = await this.client.from('profile_tags_relations').insert(newRelations);

      if (error) {
        console.error(error);
      }
    }
  }

  async ensureProfile(user: User) {
    const { data } = await this.client
      .from('profiles')
      .select('id')
      .eq('auth_id', user.id)
      .limit(1);

    if (data?.at(0)) {
      return;
    }

    if (!user.user_metadata.username) {
      console.error('Cannot create profile without username in user metadata');
    }

    // Doesn't exist - create it
    const profileType = await this.client
      .from('profile_types')
      .select('id')
      .eq('is_space', false)
      .limit(1);
    const { error } = await this.client.from('profiles').insert({
      auth_id: user.id,
      display_name: user.user_metadata.username,
      username: user.user_metadata.username,
      profile_type: profileType.data?.at(0)?.id || null,
      tenant_id: process.env.TENANT_ID,
    });

    if (error) {
      console.error('Error creating profile for user:', error);
    }
  }

  async updateUserActivity(userId: string) {
    return await this.client
      .from('profiles')
      .update({ last_active: new Date().toISOString() })
      .eq('auth_id', userId);
  }

  /**
   * Calculate the moderation status for a profile's map pin based on profile type changes.
   *    If a profile changes from a space to 'member', the pin is automatically accepted.
   *    If it changes from 'member' to a space, the pin requires moderation.
   */
  private determinePinModeration(types: ProfileType[], profile: DBProfile, type: string) {
    if (!profile.pin) {
      return undefined;
    }

    const selectedType = types.find((x) => x.name === type);
    const currentType = types.find((x) => x.id === profile.profile_type);

    let newValue: 'accepted' | 'awaiting-moderation' | undefined = undefined;

    if (!selectedType || !currentType) {
      return undefined;
    }
    if (currentType.isSpace && !selectedType.isSpace) {
      newValue = 'accepted';
    }
    if (!currentType.isSpace && selectedType.isSpace) {
      newValue = 'awaiting-moderation';
    }

    if (newValue === profile.pin.moderation) {
      return undefined;
    }

    return newValue;
  }
}
