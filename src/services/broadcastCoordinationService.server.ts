import { discordServiceServer } from './discordService.server'
import { notificationsService } from './notificationsService.server'
import { notificationsSupabaseServiceServer } from './notificationSupabaseService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProfile, DBResearchUpdate, ResearchUpdate } from 'oa-shared'

function researchUpdate(
  update: ResearchUpdate,
  profile: DBProfile | null,
  client: SupabaseClient,
  request: Request,
  oldUpdate?: DBResearchUpdate,
) {
  const beforeCheck = oldUpdate ? !!oldUpdate.is_draft : true
  const research = update.research
  const siteUrl = new URL(request.url).origin.replace('http:', 'https:')

  if (!research || !profile || research?.is_draft) {
    return
  }

  if (beforeCheck && update.isDraft === false && !!update.research) {
    notificationsService.sendResearchUpdateNotification(
      client,
      research,
      update,
      profile as DBProfile,
    )
    notificationsSupabaseServiceServer.createNotificationsResearchUpdate(
      research,
      update,
      profile as DBProfile,
      client,
    )
    discordServiceServer.postWebhookRequest(
      `🧪 ${profile.username} posted a new research update: ${update.title}\nCheck it out here: <${siteUrl}/research/${research.slug}#update_${update.id}>`,
    )
  }
}

export const broadcastCoordinationServiceServer = {
  researchUpdate,
}
