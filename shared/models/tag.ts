import type { IDoc } from './document';

export interface DBTag {
  id: number;
  created_at: string;
  modified_at: string | null;

  name: string;
}

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
