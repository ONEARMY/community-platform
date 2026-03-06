import type { ContentType } from './common';
import type { IDoc } from './document';

export interface DBCategory {
  id: number;
  created_at: string;
  modified_at: string | null;

  name: string;
  type: ContentType;
}

export class Category implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
  name: string;
  type: ContentType;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static fromDB(category: DBCategory) {
    const { created_at, id, modified_at, name, type } = category;
    return new Category({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      name,
      type,
    });
  }
}
