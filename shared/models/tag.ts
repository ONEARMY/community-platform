import type { Tables } from '../database';
import type { IDoc } from './document';

export type DBTag = Pick<Tables<'tags'>, 'id' | 'created_at' | 'modified_at' | 'name'>;

export class Tag implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;

  name: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static fromDB(tag: DBTag) {
    const { created_at, id, modified_at, name } = tag;
    return new Tag({
      id,
      createdAt: new Date(created_at),
      modified_at: modified_at ? new Date(modified_at) : null,
      name,
    });
  }
}
