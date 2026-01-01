export class DBProfileBadge {
  id: number;
  name: string;
  display_name: string;
  image_url: string;
  action_url: string | null;
  premium_tier: number | null;

  constructor(obj: Partial<DBProfileBadge>) {
    Object.assign(this, obj);
  }
}

export class DBProfileBadgeJoin {
  profile_badges: DBProfileBadge;
}

export class ProfileBadge {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string;
  actionUrl?: string;
  premiumTier?: number;

  constructor(obj: Partial<ProfileBadge>) {
    Object.assign(this, obj);
  }

  static fromDBJoin(value: DBProfileBadgeJoin): ProfileBadge {
    const badge = value.profile_badges;
    return new ProfileBadge({
      id: badge.id,
      name: badge.name,
      displayName: badge.display_name,
      imageUrl: badge.image_url,
      actionUrl: badge.action_url || undefined,
      premiumTier: badge.premium_tier || undefined,
    });
  }

  static fromDB(value: DBProfileBadge) {
    return new ProfileBadge({
      id: value.id,
      name: value.name,
      displayName: value.display_name,
      imageUrl: value.image_url,
      actionUrl: value.action_url || undefined,
      premiumTier: value.premium_tier || undefined,
    });
  }
}
