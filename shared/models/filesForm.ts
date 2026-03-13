import type { IMediaFile } from './media';

export interface IFilesForm {
  files: IMediaFile[] | null;
  fileLink: string | null;
}
