import type { DBAuthor } from './author';
import { Author } from './author';
import type { IDBDocSB, IDoc } from './document';
import type { DBMedia, Image, MediaWithPublicUrl } from './media';

export const REMAKE_MAX_IMAGES = 10;
export const REMAKE_MAX_DESCRIPTION_LENGTH = 1000;

export class DBRemake implements IDBDocSB {
  readonly id: number;
  readonly created_at: Date;
  readonly modified_at: Date | null;
  readonly project_id: number;
  readonly created_by: number;
  readonly description: string | null;
  readonly images: DBMedia[] | null;
  readonly tenant_id: string;
  readonly profile?: DBAuthor;

  constructor(obj: Partial<DBRemake>) {
    Object.assign(this, obj);
  }
}

export class Remake implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
  projectId: number;
  description: string | null;
  images: MediaWithPublicUrl[];
  author: Author | null;

  constructor(obj: Remake) {
    Object.assign(this, obj);
  }

  static fromDB(obj: DBRemake, images: Image[] = [], authorPhoto?: Image) {
    const orderedImages =
      obj.images
        ?.map((dbImage) => {
          const publicImage = images.find((img) => img.id === dbImage.id);
          return publicImage ? { ...dbImage, ...publicImage } : null;
        })
        .filter((image): image is MediaWithPublicUrl => image !== null) || [];

    return new Remake({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      projectId: obj.project_id,
      description: obj.description,
      images: orderedImages,
      author: obj.profile ? Author.fromDB(obj.profile, authorPhoto) : null,
    });
  }
}

export type RemakeDTO = {
  images: DBMedia[];
  description: string | null;
};
