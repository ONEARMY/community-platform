import type { DBProfileBadge } from './profileBadge';

export class DBUpgradeBadge {
  id: number;
  action_label: string;
  badge_id: number;
  is_space: boolean;
  action_url: string;
  tenant_id: string;
  badge?: DBProfileBadge;

  constructor(obj: Partial<DBUpgradeBadge>) {
    Object.assign(this, obj);
  }
}

export class UpgradeBadge {
  id: number;
  actionLabel: string;
  badgeId: number;
  isSpace: boolean;
  actionUrl: string;
  badgeImageUrl?: string;
  badgeName?: string;

  constructor(obj: Partial<UpgradeBadge>) {
    Object.assign(this, obj);
  }

  static fromDB(value: DBUpgradeBadge) {
    return new UpgradeBadge({
      id: value.id,
      actionLabel: value.action_label,
      badgeId: value.badge_id,
      isSpace: value.is_space,
      actionUrl: value.action_url,
      badgeImageUrl: value.badge?.image_url,
      badgeName: value.badge?.name,
    });
  }
}
