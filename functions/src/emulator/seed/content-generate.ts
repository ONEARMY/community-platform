import { DifficultyLevel, IModerationStatus } from 'oa-shared'
import { MOCK_AUTH_USERS } from 'oa-shared/mocks/auth'

import { setDoc, updateDoc } from '../../Firebase/firestoreDB'

import type { ILibrary, IUserDB } from 'oa-shared'
import type { IMockAuthUser } from 'oa-shared/mocks/auth'

/**
 * Populate additional mock library projects alongside production data for ease of testing
 * TODO - should create from factories used in unit mocks once available in shared
 */
export async function seedContentGenerate() {
  // create mock library projects just for demo_beta_tester and demo_admin users
  for (const user of Object.values(MOCK_AUTH_USERS).slice(1, 3)) {
    await setMockLibrary(user)
    await setMockNotifications(user)
  }
  return
}

export function getMockLibraryItem(
  uid: string,
  moderation: ILibrary.DB['moderation'] = IModerationStatus.ACCEPTED,
) {
  const _id = `00_${uid}_howto`
  const loginInfo = `username : ${uid}@example.com\npassword : ${uid}`
  const library: ILibrary.DB = {
    _id,
    _created: new Date().toISOString(),
    _modified: new Date().toISOString(),
    _contentModifiedTimestamp: new Date().toISOString(),
    _deleted: false,
    _createdBy: uid,
    cover_image: {
      downloadUrl: `https://platform.onearmy.earth/images/One-Army-Star-Logo.svg`,
    } as any,
    description: `You can edit this howto by logging in as:\n\n${loginInfo}`,
    difficulty_level: DifficultyLevel.EASY,
    files: [],
    mentions: [],
    slug: _id,
    steps: [],
    time: '',
    title: 'Mock Howto',
    moderation,
    previousSlugs: [_id],
    totalComments: 0,
  }

  return library
}

export async function setMockLibrary(user: Pick<IMockAuthUser, 'uid'>) {
  const { uid } = user
  const library = getMockLibraryItem(uid)
  await setDoc('library', library._id, library)
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
