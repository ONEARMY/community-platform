import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthorVotes, DBProfile } from 'oa-shared';
import { Profile, ProfileBadge, ProfileTag, ProfileType } from 'oa-shared';
import { ImageServiceServer } from 'src/services/imageService.server';

export class ProfileFactory {
  private imageService: ImageServiceServer;
  constructor(client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client);
  }

  fromDB(dbProfile: DBProfile, authorVotes?: AuthorVotes[]): Profile {
    const photo = this.imageService.getPublicUrl(dbProfile.photo);

    const coverImages =
      dbProfile.cover_images && dbProfile.cover_images.length > 0 ? this.imageService.getPublicUrls(dbProfile.cover_images) : null;

    let impact = null;
    let visitorPolicy = null;

    try {
      if (dbProfile.impact) {
        if (typeof dbProfile.impact === 'string') {
          impact = JSON.parse(dbProfile.impact);
        } else if (typeof dbProfile.impact === 'object') {
          impact = dbProfile.impact;
        }
      }
    } catch (_) {
      console.error('error parsing impact');
    }

    try {
      if (dbProfile.visitor_policy) {
        if (typeof dbProfile.visitor_policy === 'string') {
          visitorPolicy = JSON.parse(dbProfile.visitor_policy);
        } else if (typeof dbProfile.impact === 'object' && (dbProfile.visitor_policy as any)?.policy) {
          visitorPolicy = dbProfile.visitor_policy;
        }
      }
    } catch (_) {
      console.error('error parsing visitor policy');
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
      visitorPolicy,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages,
      impact,
      isContactable: !!dbProfile.is_contactable,
      lastActive: dbProfile.last_active ? new Date(dbProfile.last_active) : null,
      website: dbProfile.website,
      patreon: dbProfile.patreon || null,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
      donationsEnabled: !!dbProfile.donations_enabled,
      tags: dbProfile.tags ? dbProfile.tags?.map((x) => ProfileTag.fromDBJoin(x)) : [],
      badges: dbProfile.badges ? dbProfile.badges?.map((x) => ProfileBadge.fromDBJoin(x)) : [],
    });
  }
}
