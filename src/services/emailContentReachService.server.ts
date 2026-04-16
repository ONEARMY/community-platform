import type { SupabaseClient } from '@supabase/supabase-js';
import { DBEmailContentReach } from 'oa-shared';

export class EmailContentReachServiceServer {
  constructor(private client: SupabaseClient) {}

  async getAll(): Promise<DBEmailContentReach[] | null> {
    try {
      const response = await this.client.from('email_content_reach').select('*');
      return response.data as DBEmailContentReach[];
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async getDefault() {
    const dbAll = await this.getAll();
    const defaultOption = dbAll
      ? (dbAll.find(({ default_option }) => default_option === true) as DBEmailContentReach)
      : null;

    return defaultOption;
  }
}
