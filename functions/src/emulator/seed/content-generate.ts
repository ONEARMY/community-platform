import { IMockAuthUser, MOCK_AUTH_USERS } from 'oa-shared/mocks/auth'
import type { IHowtoDB, IUserDB } from '../../models'
import { setDoc, updateDoc } from '../../Firebase/firestoreDB'

/**
 * Populate additional mock howtos alongside production data for ease of testing
 * TODO - should create from factories used in unit mocks once available in shared
 */
export async function seedContentGenerate() {
  // create mock howtos just for demo_beta_tester and demo_admin users
  for (const user of Object.values(MOCK_AUTH_USERS).slice(1, 3)) {
    await setMockHowto(user)
    await setMockNotifications(user)
  }
  return
}

export async function setMockHowto(
  user: Pick<IMockAuthUser, 'uid'>,
  moderation: IHowtoDB['moderation'] = 'accepted',
) {
  const { uid } = user
  const _id = `00_${uid}_howto`
  const loginInfo = `username : ${uid}@example.com\npassword : ${uid}`
  const howto: IHowtoDB = {
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
    difficulty_level: 'Easy',
    files: [],
    mentions: [],
    slug: _id,
    steps: [],
    time: '',
    title: 'Mock Howto',
    moderation,
    comments: [
      {
        _created: new Date().toISOString(),
        _creatorId: 'demo_user',
        _id: 'mock_comment',
        creatorName: 'demo_user',
        text: 'Mock generated comment',
      },
    ],
    previousSlugs: [_id],
  }
  await setDoc('howtos', _id, howto)
  return howto
}

async function setMockNotifications(user: IMockAuthUser) {
  const update: Partial<IUserDB> = {
    notifications: [
      {
        type: 'new_comment',
        notified: false,
        read: false,
        _created: new Date().toISOString(),
        _id: 'mock_notification',
        triggeredBy: {
          displayName: 'Demo User',
          userId: 'demo_user',
        },
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
