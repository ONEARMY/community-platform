// Base level for all content on supabase
export interface IDBDocSB {
  readonly id: number;
  readonly created_at: Date;
  readonly modified_at: Date | null;
}

export interface IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
}

export interface IDBDownloadable {
  file_download_count?: number | null;
  file_link: string | null;
  files: { id: string; name: string; size: number }[] | null;
}

export interface IDownloadable {
  fileDownloadCount: number | null;
  files: { id: string; name: string; size: number }[] | null;
  hasFileLink: boolean | null;
}
