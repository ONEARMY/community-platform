import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBAdminComment, DBComment, DiscussionContentType } from 'oa-shared';
import { AdminComment } from 'oa-shared';
import { isModuleSupported, MODULE } from 'src/modules';
import { ITEMS_PER_PAGE } from 'src/pages/Admin/Comments/constants';

const ADMIN_COMMENT_SELECT = `
  id,
  comment,
  source_type,
  source_id,
  parent_id,
  created_at,
  deleted,
  profile:profiles(username, display_name)
`;

interface AdminCommentsPage {
  comments: AdminComment[];
  page: number;
  totalPages: number;
}

type CommentSource = { id: number; slug: string; deleted: boolean | null };
type CommentResearchUpdate = {
  id: number;
  deleted: boolean | null;
  is_draft: boolean | null;
  research: CommentSource | null;
};

const COMMENT_MODULES: Record<DiscussionContentType, MODULE> = {
  projects: MODULE.LIBRARY,
  questions: MODULE.QUESTIONS,
  news: MODULE.NEWS,
  research_updates: MODULE.RESEARCH,
};

export class CommentServiceServer {
  constructor(private client: SupabaseClient) {}

  async getDiscussionComments(
    sourceType: string,
    sourceId: string,
    currentUserId: number | null,
    highlightedId: number | null,
  ) {
    const query = () =>
      this.client.rpc('get_comments_with_votes', {
        p_source_type: sourceType,
        p_source_id: sourceId,
        p_current_user_id: currentUserId,
      });
    const { data, error } = await query();
    if (error) {
      throw error;
    }
    const comments = (data ?? []) as DBComment[];

    const includeComment = async (id: number) => {
      const existing = comments.find((comment) => comment.id === id);
      if (existing) {
        return existing;
      }
      const { data, error } = await query().eq('id', id);
      if (error) {
        throw error;
      }
      const comment = (data as DBComment[] | null)?.[0];
      if (comment) {
        comments.push(comment);
      }
      return comment;
    };

    if (highlightedId !== null) {
      const comment = await includeComment(highlightedId);
      if (comment?.parent_id) {
        await includeComment(comment.parent_id);
      }
    }
    return comments;
  }

  async getAdminPage(requestedPage: number, supportedModules = ''): Promise<AdminCommentsPage> {
    let total = await this.count();
    let totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    let page = Math.min(Math.max(1, requestedPage), totalPages);
    let rows = total === 0 ? [] : await this.getRows(page);

    if (page > 1 && rows.length === 0) {
      total = await this.count();
      totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
      page = Math.min(page, totalPages);
      rows = total === 0 ? [] : await this.getRows(page);
    }
    const [urls, notificationCounts] = await Promise.all([
      this.getLiveUrls(rows, supportedModules),
      Promise.all(rows.map((row) => this.countNotifications(row.id))),
    ]);
    const comments = rows.map((row, index) =>
      AdminComment.fromDB(row, notificationCounts[index], urls.get(row.id) ?? null),
    );

    return { comments, page, totalPages };
  }

  private async getLiveUrls(rows: DBAdminComment[], supportedModules: string) {
    const candidates = rows.filter(
      (row) =>
        !row.deleted &&
        row.source_id !== null &&
        isModuleSupported(supportedModules, COMMENT_MODULES[row.source_type]),
    );
    const sourceUrls = new Map<string, string>();
    const parentIds = candidates.flatMap((row) => (row.parent_id === null ? [] : [row.parent_id]));
    const parents = new Map<
      number,
      Pick<DBComment, 'id' | 'parent_id' | 'source_id' | 'source_type'>
    >();

    await Promise.all([
      ...Object.keys(COMMENT_MODULES).map(async (type) => {
        const ids = candidates
          .filter((row) => row.source_type === type)
          .map((row) => row.source_id!);
        if (ids.length === 0) {
          return;
        }

        const { data, error } = await this.client
          .from(type)
          .select(
            type === 'research_updates'
              ? 'id,deleted,is_draft,research:research_id(id,slug,deleted)'
              : 'id,slug,deleted',
          )
          .in('id', ids);
        if (error) {
          throw error;
        }

        for (const source of (data ?? []) as unknown as (CommentSource & CommentResearchUpdate)[]) {
          if (source.deleted) {
            continue;
          }
          if (type === 'research_updates') {
            if (!source.is_draft && source.research?.slug && !source.research.deleted) {
              sourceUrls.set(
                `${type}:${source.id}`,
                `/research/${source.research.slug}?update_${source.id}`,
              );
            }
          } else if (source.slug) {
            sourceUrls.set(
              `${type}:${source.id}`,
              `/${type === 'projects' ? 'library' : type}/${source.slug}`,
            );
          }
        }
      }),
      (async () => {
        if (parentIds.length === 0) {
          return;
        }
        const { data, error } = await this.client
          .from('comments')
          .select('id,parent_id,source_id,source_type')
          .in('id', parentIds);
        if (error) {
          throw error;
        }
        for (const parent of data ?? []) {
          parents.set(parent.id, parent);
        }
      })(),
    ]);

    const urls = new Map<number, string>();
    for (const row of candidates) {
      const parent = row.parent_id === null ? null : parents.get(row.parent_id);
      if (
        row.parent_id !== null &&
        (!parent ||
          parent.parent_id !== null ||
          parent.source_id !== row.source_id ||
          parent.source_type !== row.source_type)
      ) {
        continue;
      }
      const url = sourceUrls.get(`${row.source_type}:${row.source_id}`);
      if (url) {
        urls.set(row.id, `${url}#comment:${row.id}`);
      }
    }
    return urls;
  }

  private async count(): Promise<number> {
    const { count, error } = await this.client
      .from('comments')
      .select('id', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return count ?? 0;
  }

  private async getRows(page: number): Promise<DBAdminComment[]> {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const { data, error } = await this.client
      .from('comments')
      .select(ADMIN_COMMENT_SELECT)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + ITEMS_PER_PAGE - 1);

    if (error) {
      throw error;
    }

    return (data ?? []) as unknown as DBAdminComment[];
  }

  private async countNotifications(commentId: number): Promise<number> {
    const { count, error } = await this.client
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .in('content_type', ['comments', 'comment', 'reply'])
      .eq('content_id', commentId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  }
}
