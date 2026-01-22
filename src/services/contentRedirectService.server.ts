import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBComment, DBResearchItem, NotificationContentType } from 'oa-shared';

// TODO: Add Tests
export class ContentRedirectServiceServer {
  constructor(private client: SupabaseClient) {}

  async getUrl(id: number, contentType: NotificationContentType): Promise<string | null> {
    switch (contentType) {
      case 'research_updates':
        return this.resolveResearchUpdateUrl(id);
      case 'comments':
        return this.resolveCommentUrl(id);
    }
  }

  private async resolveResearchUpdateUrl(updateId: number) {
    const { data, error } = await this.client
      .from('research_updates')
      .select('research:research_id(slug)')
      .eq('id', updateId)
      .single();

    if (error || !data || !data.research) {
      return null;
    }

    const slug = (data.research as unknown as DBResearchItem).slug;

    return `/research/${slug}#update_${updateId}`;
  }

  private async resolveCommentUrl(commentId: number) {
    const { data, error } = await this.client
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (error || !data) {
      return null;
    }

    const comment = data as DBComment;

    switch (comment.source_type) {
      case 'research_update':
        return this.resolveResearchUpdateCommentUrl(comment.source_id!, comment.id);
      case 'news':
      case 'projects':
      case 'questions':
        return this.resolveGenericContentCommentUrl(
          comment.source_type,
          comment.source_id!,
          comment.id,
        );
    }
  }

  private async resolveResearchUpdateCommentUrl(updateId: number, commentId: number) {
    const { data, error } = await this.client
      .from('research_updates')
      .select('research:research_id(slug)')
      .eq('id', updateId)
      .single();

    if (error || !data || !data.research) {
      return null;
    }

    const slug = (data.research as unknown as DBResearchItem).slug;

    return `/research/${slug}?update_${updateId}#comment:${commentId}`;
  }

  private async resolveGenericContentCommentUrl(
    contentType: 'questions' | 'projects' | 'news',
    contentId: number,
    commentId: number,
  ) {
    const { data, error } = await this.client
      .from(contentType)
      .select('slug')
      .eq('id', contentId)
      .single();

    if (error || !data || !data.slug) {
      return null;
    }

    const basePath = contentType === 'projects' ? 'library' : contentType;

    return `/${basePath}/${data.slug}#comment:${commentId}`;
  }
}
