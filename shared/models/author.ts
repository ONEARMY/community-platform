import type { DBMedia, Image } from './media';
import type { DBProfileBadge, DBProfileBadgeJoin } from './profileBadge';
import { ProfileBadge } from './profileBadge';
import type { DBProfileType } from './profileType';
import { ProfileType } from './profileType';

// TODO: derive from DBProfile - not doing because was causing circular dependencies
export type DBAuthor = {
  readonly id: number;
  readonly username: string;
  readonly country: string;
  readonly display_name: string;
  readonly photo: DBMedia | null;
  readonly badges?: DBProfileBadgeJoin[] | DBProfileBadge[];
  readonly donations_enabled?: boolean;
  readonly profile_type?: DBProfileType;
};

export class Author {
  id: number;
  country?: string;
  displayName: string;
  badges?: ProfileBadge[];
  photo: Image | null;
  username: string;
  donationsEnabled?: boolean;
  profileType?: ProfileType;

  constructor(author: Author) {
    Object.assign(this, author);
  }

  static fromDB(dbAuthor: DBAuthor, photo?: Image) {
    const badges =
      dbAuthor.badges?.map((badge) =>
        (badge as any).profile_badges
          ? ProfileBadge.fromDBJoin(badge as DBProfileBadgeJoin)
          : ProfileBadge.fromDB(badge as DBProfileBadge),
      ) || [];

    return new Author({
      ...dbAuthor,
      badges,
      displayName: dbAuthor.display_name,
      photo: photo ?? null,
      donationsEnabled: dbAuthor.donations_enabled,
      profileType: dbAuthor.profile_type ? ProfileType.fromDB(dbAuthor.profile_type) : undefined,
    });
  }
}
