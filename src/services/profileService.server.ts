import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBAuthorVotes, DBProfile } from 'oa-shared'

export class ProfileServiceServer {
  constructor(private client: SupabaseClient) {}

  async getByAuthId(id: string): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select('*')
      .eq('auth_id', id)
      .single()

    if (!data) {
      return null
    }

    return data as DBProfile
  }

  async getUsersByUsername(usernames: string[]): Promise<DBProfile[] | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `id,
        username,
        display_name,
        is_verified,
        is_supporter,
        photo,
        cover_images,
        country,
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        )`,
      )
      .in('username', usernames)

    if (!data) {
      return null
    }

    return data as unknown as DBProfile[]
  }

  async getByUsername(username: string): Promise<DBProfile | null> {
    const { data } = await this.client
      .from('profiles')
      .select(
        `*,
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        )`,
      )
      .eq('username', username)
      .single()

    if (!data) {
      return null
    }

    return data as DBProfile
  }

  async incrementViewCount(id: number, totalViews: number) {
    return await this.client
      .from('profiles')
      .update({ total_views: (totalViews || 0) + 1 })
      .eq('id', id)
  }

  async getAuthorUsefulVotes(id: number) {
    const { data, error } = await this.client.rpc('get_author_vote_counts', {
      id,
    })

    if (error || !data) {
      console.error(error)
      return null
    }

    return data as DBAuthorVotes[]
  }

  async updateProfile(values: any) {
    values
    // TODO
  }
}
