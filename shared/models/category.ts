import type { Tables } from '../database';
import type { ContentType } from './common';
import type { IDoc } from './document';

export type DBCategory = Pick<
  Tables<'categories'>,
  'id' | 'created_at' | 'name' | 'type' | 'image_url' | 'description'
>;

export class Category implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
  name: string;
  type: ContentType;
  imageUrl: string | null;
  description: string | null;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static fromDB(category: DBCategory) {
    const { created_at, id, name, type, image_url, description } = category;
    return new Category({
      id,
      createdAt: new Date(created_at),
      modifiedAt: null,
      name,
      type,
      imageUrl: image_url || null,
      description: description || null,
    });
  }
}
