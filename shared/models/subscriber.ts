import type { ContentType } from './common';

export class DBSubscriber {
  id: number;
  created_at: string;
  user_id: number;
  content_id: number;
  content_type: ContentType;
}
