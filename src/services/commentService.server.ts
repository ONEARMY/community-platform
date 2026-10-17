import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'oa-shared';
import { AdminComment } from 'oa-shared';

export class CommentServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async getAdminPage(page: number, pageSize: number) {
    const { data, error } = await this.client.rpc('get_admin_comments', {
      p_limit: pageSize,
      p_offset: (page - 1) * pageSize,
    });

    if (error) {
      throw error;
    }

    return {
      comments: data.map(AdminComment.fromDB),
      totalCount: data[0]?.total_count ?? 0,
    };
  }
}
