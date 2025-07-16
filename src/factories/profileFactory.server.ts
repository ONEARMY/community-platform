import { Profile, ProfileTag } from 'oa-shared'
import { ImageServiceServer } from 'src/services/imageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthorVotes, DBProfile } from 'oa-shared'

export class ProfileFactory {
  private imageService: ImageServiceServer
  constructor(client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client)
  }

  createProfile(dbProfile: DBProfile, authorVotes?: AuthorVotes[]): Profile {
    const photo = dbProfile.photo
      ? this.imageService.getPublicUrl(dbProfile.photo)
      : null

    const coverImages =
      dbProfile.cover_images && dbProfile.cover_images.length > 0
        ? this.imageService.getPublicUrls(dbProfile.cover_images)
        : null

    return new Profile({
      id: dbProfile.id,
      createdAt: dbProfile.created_at,
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      photo: photo || null,
      isSupporter: dbProfile.is_supporter,
      isVerified: dbProfile.is_verified,
      roles: dbProfile.roles || null,
      type: dbProfile.type,
      openToVisitors: dbProfile.open_to_visitors,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages,
      impact: dbProfile.impact,
      isContactable: !!dbProfile.is_contactable,
      lastActive: dbProfile.last_active,
      website: dbProfile.website,
      location: dbProfile.location,
      patreon: dbProfile.patreon || null,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
      tags: dbProfile.tags?.map((x) => ProfileTag.fromDB(x)),
    })
  }
}
