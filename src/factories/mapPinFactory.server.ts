import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMapPin, DBPinProfile, PinProfile } from 'oa-shared';
import { MapPin, ProfileBadge, ProfileTag, ProfileType } from 'oa-shared';
import { ImageServiceServer } from 'src/services/imageService.server';

export class MapPinFactory {
  private imageService: ImageServiceServer;
  constructor(client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client);
  }

  fromDBWithProfile(pin: DBMapPin): MapPin {
    const profile = this.getProfilePin(pin.profile);

    return new MapPin({
      id: pin.id,
      administrative: pin.administrative,
      name: pin.name,
      country: pin.country,
      countryCode: pin.country_code,
      lat: pin.lat,
      lng: pin.lng,
      moderation: pin.moderation,
      postCode: pin.post_code,
      profileId: pin.profile_id,
      moderationFeedback: pin.moderation_feedback,
      profile,
    });
  }

  private getProfilePin(profile: DBPinProfile): PinProfile {
    const photo = profile.photo ? this.imageService.getPublicUrl(profile.photo) : null;
    const coverImages = profile.cover_images
      ? profile.cover_images.map((image) => this.imageService.getPublicUrl(image))
      : null;

    return {
      id: profile.id,
      about: profile.about,
      username: profile.username,
      country: profile.country,
      coverImages,
      displayName: profile.display_name,
      visitorPolicy: profile.visitor_policy,
      type: profile.type ? ProfileType.fromDB(profile.type) : null,
      photo: photo || null,
      lastActive: profile.last_active,
      isContactable: profile.is_contactable,
      tags: profile.tags?.map((x) => ProfileTag.fromDBJoin(x)),
      badges: profile.badges?.map((x) => ProfileBadge.fromDBJoin(x)),
    } as PinProfile;
  }
}
