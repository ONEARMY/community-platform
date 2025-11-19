import type { MediaFile } from './media';

export interface IFilesForm {
  files?: File[];
  fileLink?: string;
  existingFiles?: MediaFile[] | null;
}
