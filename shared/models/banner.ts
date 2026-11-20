import type { Tables } from '../database';
import type { IDoc } from './document';

export type DBBanner = Pick<
  Tables<'banners'>,
  'id' | 'created_at' | 'modified_at' | 'text' | 'url'
>;

export class Banner implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
  text: string;
  url: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static fromDB(banner: DBBanner) {
    const { created_at, id, modified_at, text, url } = banner;
    return new Banner({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      text,
      url,
    });
  }
}
