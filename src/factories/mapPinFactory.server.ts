import { MapPin, ProfileTag } from 'oa-shared'
import { ImageServiceServer } from 'src/services/imageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMapPin, DBPinProfile, PinProfile } from 'oa-shared'

export class MapPinFactory {
  private imageService: ImageServiceServer
  constructor(client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client)
  }

  fromDB(pin: DBMapPin): MapPin {
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
      profile: null,
    })
  }

  fromDBWithProfile(pin: DBMapPin): MapPin {
    const profile = this.createPinProfile(pin.profile)

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
    })
  }

  private createPinProfile(profile: DBPinProfile): PinProfile {
    const photo = profile.photo
      ? this.imageService.getPublicUrl(profile.photo)
      : null

    return {
      id: profile.id,
      about: profile.about,
      username: profile.username,
      country: profile.country,
      displayName: profile.display_name,
      isSupporter: profile.is_supporter,
      isVerified: profile.is_verified,
      openToVisitors: profile.open_to_visitors,
      type: profile.type,
      photo: photo || null,
      isContactable: profile.is_contactable,
      tags: profile.tags?.map((x) => ProfileTag.fromDB(x)),
    } as PinProfile
  }
}
