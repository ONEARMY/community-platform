import { MOCK_AUTH_USERS } from 'oa-shared/mocks/auth'

import { updateDoc } from '../../Firebase/firestoreDB'

import type { IUserDB } from 'oa-shared'
import type { IMockAuthUser } from 'oa-shared/mocks/auth'

/**
 * Populate additional mock library projects alongside production data for ease of testing
 * TODO - should create from factories used in unit mocks once available in shared
 */
export async function seedContentGenerate() {
  // create mock library projects just for demo_beta_tester and demo_admin users
  for (const user of Object.values(MOCK_AUTH_USERS).slice(1, 3)) {
    await setMockNotifications(user)
  }
  return
}

async function setMockNotifications(user: IMockAuthUser) {
  const update: Partial<IUserDB> = {
    notifications: [
      {
        type: 'new_comment_discussion',
        notified: false,
        read: false,
        _created: new Date().toISOString(),
        _id: 'mock_notification',
        triggeredBy: {
          displayName: 'Demo User',
          userId: 'demo_user',
        },
        relevantUrl: '/testing-demo',
        title: 'Demo Title',
      },
    ],
    notification_settings: {
      emailFrequency: 'weekly' as any, // should set from Enum but want to avoid import
      enabled: {
        new_comment: true,
        howto_useful: true,
        howto_mention: true,
        howto_approved: true,
        howto_needs_updates: true,
        map_pin_approved: true,
        map_pin_needs_updates: true,
        new_comment_discussion: true,
        new_comment_research: true,
        research_useful: true,
        research_mention: true,
        research_update: true,
        research_approved: true,
        research_needs_updates: true,
      },
    },
  }
  await updateDoc('users', user.uid, update)
}
