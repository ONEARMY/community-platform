import type { IDBDocSB, IDoc } from './document';

export class DBTag implements IDBDocSB {
  id: number;
  created_at: Date;
  modified_at: Date | null;

  name: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static toDB(tag: Tag) {
    const { createdAt, id, modifiedAt, name } = tag;
    return new DBTag({
      id,
      created_at: new Date(createdAt),
      modified_at: modifiedAt ? new Date(modifiedAt) : null,
      name,
    });
  }
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
