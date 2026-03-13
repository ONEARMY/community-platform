export class DBMedia {
  id: string;
  path: string;
  fullPath: string;

  constructor(obj: DBMedia) {
    this.id = obj.id;
    this.path = obj.path;
    this.fullPath = obj.fullPath;
  }

  static fromPublicMedia(obj: MediaWithPublicUrl) {
    return new DBMedia({
      id: obj.id,
      path: obj.path,
      fullPath: obj.fullPath,
    });
  }
}

interface IMedia {
  id: string;
  publicUrl: string;
}

export interface IMediaFile {
  id: string;
  name: string;
  size: number;
}

export class Image implements IMedia {
  id: string;
  publicUrl: string;

  constructor(obj: Image) {
    Object.assign(this, obj);
  }
}

export class MediaFile implements IMediaFile {
  id: string;
  name: string;
  size: number;
  url?: string;

  constructor(obj: MediaFile) {
    Object.assign(this, obj);
  }
}

export type MediaWithPublicUrl = DBMedia & Image;
