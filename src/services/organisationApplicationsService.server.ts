import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Tracks auth accounts that chose the organisation sign-up path but have not
 * submitted their application form yet. The profile row is only created on
 * submission, at which point the application row is deleted.
 */
export class OrganisationApplicationsServiceServer {
  constructor(private client: SupabaseClient) {}

  async create(authId: string) {
    return await this.client.from('organisation_applications').insert({
      auth_id: authId,
      tenant_id: process.env.TENANT_ID,
    });
  }

  async existsByAuthId(authId: string): Promise<boolean> {
    const { data } = await this.client
      .from('organisation_applications')
      .select('id')
      .eq('auth_id', authId)
      .maybeSingle();

    return !!data;
  }

  async deleteByAuthId(authId: string) {
    return await this.client.from('organisation_applications').delete().eq('auth_id', authId);
  }
}
