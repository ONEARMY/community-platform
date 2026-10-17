import type { Database } from '../database';
import type { DBAuthor } from './author';
import { Author } from './author';
import type { DiscussionContentType } from './common';
import type { IDBDocSB, IDoc } from './document';

export class DBComment implements IDBDocSB {
  readonly id: number;
  readonly created_at: string;
  readonly modified_at: string | null;
  readonly created_by: number | null;
  readonly deleted: boolean;

  readonly profile?: DBAuthor;
  readonly comment: string;
  readonly source_id: number | null;
  readonly source_type: DiscussionContentType;
  readonly source_id_legacy: string | null;
  readonly parent_id: number | null;
  readonly vote_count?: number;
  readonly has_voted?: boolean;

  constructor(comment: DBComment) {
    Object.assign(this, comment);
  }
}

export class Comment implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;
  deleted: boolean;

  createdBy: Author | null;
  comment: string;
  sourceId: number | string;
  sourceType: DiscussionContentType;
  parentId: number | null;
  highlighted?: boolean;
  voteCount?: number;
  hasVoted?: boolean;
  replies?: Reply[];

  constructor(comment: Comment) {
    Object.assign(this, comment);
  }

  static fromDB(obj: DBComment, replies?: Reply[]) {
    return new Comment({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      createdBy: obj.profile ? Author.fromDB(obj.profile) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      comment: obj.comment,
      sourceId: obj.source_id || obj.source_id_legacy || 0,
      sourceType: obj.source_type,
      parentId: obj.parent_id,
      deleted: obj.deleted,
      voteCount: obj.vote_count || 0,
      hasVoted: obj.has_voted,
      replies: replies,
    });
  }
}

export type Reply = Omit<Comment, 'replies'>;

export type DBAdminComment =
  Database['public']['Functions']['get_admin_comments']['Returns'][number];

const SOURCE_PATHS: Record<DiscussionContentType, string> = {
  questions: 'questions',
  projects: 'library',
  research_updates: 'research',
  news: 'news',
};

export class AdminComment {
  id: number;
  comment: string;
  sourceType: DiscussionContentType;
  sourceId: number | null;
  isReply: boolean;
  createdAt: Date;
  deleted: boolean;
  liveUrl: string | null;
  notificationCount: number;
  author: { username: string | null; displayName: string } | null;

  constructor(obj: AdminComment) {
    Object.assign(this, obj);
  }

  static fromDB(obj: DBAdminComment) {
    return new AdminComment({
      id: obj.id,
      comment: obj.comment,
      sourceType: obj.source_type,
      sourceId: obj.source_id,
      isReply: obj.parent_id !== null,
      createdAt: new Date(obj.created_at),
      deleted: obj.deleted || false,
      liveUrl: AdminComment.toLiveUrl(obj),
      notificationCount: obj.notification_count,
      author: obj.display_name ? { username: obj.username, displayName: obj.display_name } : null,
    });
  }

  private static toLiveUrl(obj: DBAdminComment) {
    if (!obj.source_slug) {
      return null;
    }
    const update = obj.source_type === 'research_updates' ? `?update_${obj.source_id}` : '';
    return `/${SOURCE_PATHS[obj.source_type]}/${obj.source_slug}${update}#comment:${obj.id}`;
  }
}
