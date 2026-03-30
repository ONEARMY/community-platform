import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBResearchItem,
  ResearchItem,
  ResearchUpdate,
  SubscribableContentTypes,
} from 'oa-shared';

export class SubscribersServiceServer {
  constructor(private client: SupabaseClient) {}

  async combineSubscribers(
    ids: (number | null | undefined)[],
    usernames: string[],
  ): Promise<number[]> {
    const profilesToSubscribe: number[] = ids.map((id) => Number(id));

    for (const username of usernames) {
      const { data } = await this.client
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();
      if (data && !!Number(data.id)) {
        profilesToSubscribe.push(Number(data.id));
      }
    }

    const uniqueIdSet = new Set([...profilesToSubscribe]);

    return [...uniqueIdSet];
  }

  async addResearchSubscribers(research: ResearchItem, profileId: number) {
    const subscribers = await this.combineSubscribers(
      [profileId],
      research.collaboratorsUsernames || [],
    );
    return Promise.all([
      subscribers.map((subscriber) => {
        this.add('research', research.id, subscriber);
      }),
    ]);
  }

  async addResearchUpdateSubscribers(update: ResearchUpdate, profileId: number) {
    const subscribers = await this.combineSubscribers(
      [profileId, update.research?.created_by],
      update.research?.collaborators || [],
    );
    return Promise.all([
      subscribers.map((subscriber) => {
        this.add('research_updates', update.id, subscriber);
      }),
    ]);
  }

  async add(contentType: SubscribableContentTypes, contentId: number, profileId: number) {
    try {
      const response = await this.client
        .from('subscribers')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('user_id', profileId)
        .single();

      if (response.data) {
        // already exists
        return;
      }

      await this.client.from('subscribers').insert({
        content_type: contentType,
        content_id: contentId,
        user_id: profileId,
        tenant_id: process.env.TENANT_ID!,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateResearchSubscribers(oldResearch: DBResearchItem, newResearch: ResearchItem) {
    const oldCollaborators = oldResearch.collaborators || [];
    const newCollaborators = newResearch.collaboratorsUsernames || [];

    const newCollaboratorUsernames = newCollaborators.filter(
      (username) => !oldCollaborators.includes(username),
    );

    if (newCollaboratorUsernames.length === 0) {
      return;
    }

    const subscribers = await this.combineSubscribers([], newCollaboratorUsernames);
    return Promise.all([
      subscribers.map((subscriber) => {
        this.add('research', newResearch.id, subscriber);
      }),
    ]);
  }
}
