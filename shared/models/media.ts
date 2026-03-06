export interface DBMedia {
  id: string;
  path: string;
  fullPath: string;
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
