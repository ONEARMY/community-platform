export type ProfileCategory = 'member' | 'space';

export class DBProfileTag {
  id: number;
  created_at: string;
  name: string;
  profile_type: string | null;

  constructor(obj: Partial<DBProfileTag>) {
    Object.assign(this, obj);
  }
}

export class DBProfileTagJoin {
  profile_tags: Pick<DBProfileTag, 'id' | 'name'>;
}

export class ProfileTag {
  id: number;
  createdAt: Date;
  name: string;
  profileType: string | null;

  constructor(obj: Partial<ProfileTag>) {
    Object.assign(this, obj);
  }

  static fromDBJoin(value: DBProfileTagJoin) {
    const tag = value.profile_tags;
    return new ProfileTag({
      id: tag.id,
      name: tag.name,
    });
  }

  static fromDB(tag: DBProfileTag) {
    return new ProfileTag({
      id: tag.id,
      createdAt: new Date(tag.created_at),
      name: tag.name,
      profileType: tag.profile_type,
    });
  }
}
