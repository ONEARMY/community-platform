import { Profile, ProfileBadge, ProfileTag, ProfileType } from 'oa-shared'
import { ImageServiceServer } from 'src/services/imageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthorVotes, DBProfile } from 'oa-shared'

export class ProfileFactory {
  private imageService: ImageServiceServer
  constructor(client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client)
  }

  fromDB(dbProfile: DBProfile, authorVotes?: AuthorVotes[]): Profile {
    const photo = this.imageService.getPublicUrl(dbProfile.photo)

    const coverImages =
      dbProfile.cover_images && dbProfile.cover_images.length > 0
        ? this.imageService.getPublicUrls(dbProfile.cover_images)
        : null

    let impact = null

    try {
      impact = dbProfile.impact ? JSON.parse(dbProfile.impact) : null
    } catch (error) {
      console.error('error parsing impact')
    }

    return new Profile({
      id: dbProfile.id,
      createdAt: new Date(dbProfile.created_at),
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      photo: photo || null,
      roles: dbProfile.roles || null,
      type: dbProfile.type ? ProfileType.fromDB(dbProfile.type) : null,
      visitorPolicy: dbProfile.visitor_policy
        ? JSON.parse(dbProfile.visitor_policy)
        : null,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages,
      impact,
      isContactable: !!dbProfile.is_contactable,
      lastActive: dbProfile.last_active
        ? new Date(dbProfile.last_active)
        : null,
      website: dbProfile.website,
      patreon: dbProfile.patreon || null,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
      tags: dbProfile.tags
        ? dbProfile.tags?.map((x) => ProfileTag.fromDBJoin(x))
        : [],
      badges: dbProfile.badges
        ? dbProfile.badges?.map((x) => ProfileBadge.fromDBJoin(x))
        : [],
    })
  }
}
