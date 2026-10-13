import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, DBComment } from 'oa-shared';
import { AdminComment } from 'oa-shared';

const ITEMS_PER_PAGE = 20;

export class CommentServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async getDiscussionComments(
    sourceType: string,
    sourceId: string,
    currentUserId: number | null,
    highlightedId: number | null,
  ) {
    const query = () =>
      this.client.rpc('get_comments_with_votes', {
        p_source_type: sourceType,
        p_source_id: Number(sourceId),
        p_current_user_id: currentUserId ?? undefined,
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

  async getAdminPage(requestedPage: number) {
    const { data, error } = await this.client.rpc('get_admin_comments', {
      p_page: requestedPage,
      p_page_size: ITEMS_PER_PAGE,
    });

    if (error) {
      throw error;
    }

    return {
      comments: data.comments.map((row) =>
        AdminComment.fromDB(row, row.notification_count, row.live_url),
      ),
      page: data.page,
      totalPages: data.total_pages,
    };
  }
}
