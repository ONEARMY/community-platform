import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBProfile, DBResearchUpdate, ResearchUpdate } from 'oa-shared';
import { discordServiceServer } from './discordService.server';
import { NotificationsSupabaseServiceServer } from './notificationsSupabaseService.server';

export class BroadcastCoordinationServiceServer {
  constructor(private client: SupabaseClient) {}

  researchUpdate(
    update: ResearchUpdate,
    profile: DBProfile | null,
    request: Request,
    oldUpdate?: DBResearchUpdate,
  ) {
    const beforeCheck = oldUpdate ? !!oldUpdate.is_draft : true;
    const research = update.research;
    const siteUrl = new URL(request.url).origin.replace('http:', 'https:');

    if (!research || !profile || research?.is_draft) {
      return;
    }

    if (beforeCheck && update.isDraft === false && !!update.research) {
      new NotificationsSupabaseServiceServer(this.client).createNotificationsResearchUpdate(
        research,
        update,
        profile as DBProfile,
      );
      discordServiceServer.postWebhookRequest(
        `🧪 ${profile.username} posted a new research update: ${update.title}\nCheck it out here: <${siteUrl}/research/${research.slug}#update_${update.id}>`,
      );
    }
  }
}
