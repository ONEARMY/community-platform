import { ProfileFactory } from 'src/factories/profileFactory.server'

import { ImageServiceServer } from './imageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBAuthorVotes,
  DBMedia,
  DBProfile,
  ProfileFormData,
} from 'oa-shared'

export class ProfileServiceServer {
  constructor(private client: SupabaseClient) {}

  async getByAuthId(id: string): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select('*')
      .eq('auth_id', id)
      .single()

    if (!data) {
      return null
    }

    return data as DBProfile
  }

  async getById(id: number): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!data) {
      return null
    }

    return data as DBProfile
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
            action_url
          )
        )`,
      )
      .in('username', usernames)

    if (!data) {
      return null
    }

    return data as unknown as DBProfile[]
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
            action_url
          )
        ),
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        )`,
      )
      .eq('username', username)
      .single()

    if (!data) {
      return null
    }

    return data as DBProfile
  }

  async incrementViewCount(id: number, totalViews: number) {
    return await this.client
      .from('profiles')
      .update({ total_views: (totalViews || 0) + 1 })
      .eq('id', id)
  }

  async getAuthorUsefulVotes(id: number) {
    const { data, error } = await this.client.rpc('get_author_vote_counts', {
      author_id: id,
    })

    if (error || !data) {
      console.error(error)
      return null
    }

    return data as DBAuthorVotes[]
  }

  async updateProfile(id: number, values: ProfileFormData) {
    const imageService = new ImageServiceServer(this.client)
    const valuesToUpdate = {
      about: values.about,
      country: values.country,
      display_name: values.displayName,
      website: values.website,
      is_contactable: values.isContactable,
      type: values.type,
      visitor_policy: values.visitorPreferencePolicy
        ? JSON.stringify({
            policy: values.visitorPreferencePolicy,
            details: values.visitorPreferenceDetails,
          })
        : null,
    } as Partial<DBProfile>

    const existingProfile = await this.getById(id)
    if (values.photo) {
      const currentImagePath = existingProfile?.photo?.path

      // remove current photo first
      if (currentImagePath) {
        await imageService.removeImages([currentImagePath])
      }

      const newPhoto = await imageService.uploadImage(
        [values.photo],
        `profiles/${id}`,
      )

      if (!newPhoto || newPhoto?.errors?.length) {
        console.error(newPhoto?.errors)
        throw new Error('Error uploading profile photo')
      }

      valuesToUpdate['photo'] = newPhoto?.media[0]
    }

    await this.updateTags(id, values.tagIds || [])

    let imagesToRemove = existingProfile?.cover_images
    let imagesToKeep: DBMedia[] = []

    if (values.existingCoverImageIds?.length) {
      imagesToRemove = imagesToRemove?.filter(
        (x) => !values.existingCoverImageIds?.includes(x.id),
      )
      imagesToKeep =
        existingProfile?.cover_images?.filter((x) =>
          values.existingCoverImageIds?.includes(x.id),
        ) || []
    }

    if (imagesToRemove?.length) {
      await imageService.removeImages(imagesToRemove?.map((x) => x.path))
    }

    let updatedCoverImages = imagesToKeep || []

    if (values.coverImages?.length) {
      const newCoverImages = await imageService.uploadImage(
        values.coverImages,
        `profiles/${id}`,
      )

      if (!newCoverImages || newCoverImages?.errors?.length) {
        console.error(newCoverImages?.errors)
        throw new Error('Error uploading cover images')
      }

      // Add the newly uploaded images to the existing ones
      updatedCoverImages = [
        ...updatedCoverImages,
        ...(newCoverImages?.media || []),
      ]
    }

    // Add the updated cover images to valuesToUpdate
    valuesToUpdate['cover_images'] = updatedCoverImages

    const { data, error } = await this.client
      .from('profiles')
      .update(valuesToUpdate)
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
            action_url
          )
        )`,
      )
      .single()
    if (error) {
      throw error
    }

    return new ProfileFactory(this.client).fromDB(data as unknown as DBProfile)
  }

  async updateTags(profileId: number, tagIds: number[]) {
    const { data } = await this.client
      .from('profile_tags_relations')
      .select('*')
      .eq('profile_id', profileId)

    // Determine which tags to add and remove
    const existingTagIds = data?.map((rel) => rel.profile_tag_id) || []
    const tagsToAdd = tagIds.filter((tagId) => !existingTagIds.includes(tagId))
    const tagsToRemove = existingTagIds.filter(
      (tagId) => !tagIds.includes(tagId),
    )

    // Remove tags that are no longer needed
    if (tagsToRemove.length > 0) {
      const { error } = await this.client
        .from('profile_tags_relations')
        .delete()
        .eq('profile_id', profileId)
        .in('profile_tag_id', tagsToRemove)

      if (error) {
        console.error(error)
      }
    }

    // Add new tags
    if (tagsToAdd.length > 0) {
      const newRelations = tagsToAdd.map((tagId) => ({
        profile_id: profileId,
        profile_tag_id: tagId,
        tenant_id: process.env.TENANT_ID,
      }))

      const { error } = await this.client
        .from('profile_tags_relations')
        .insert(newRelations)

      if (error) {
        console.error(error)
      }
    }
  }
}
