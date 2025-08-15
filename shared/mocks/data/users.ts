import { UserRole } from '../../models'

import type { Profile } from '../../models'

type Users = {
  [id: string]: Partial<Profile> & {
    email: string
    password: string
    username: string
    profileType: string
  }
}
export const users: Users = {
  subscriber: {
    createdAt: new Date('2022-01-30T18:51:57.719Z'),
    displayName: 'demo_user',
    username: 'demo_user',
    roles: [],
    coverImages: [
      {
        id: '',
        publicUrl: 'uploads/v3_users/demo_user/images/profile-cover-1.jpg',
      },
    ],
    website: 'http://demo_user.example.com',
    about: "Hi! I'm a robot 🤖 Beep boop",
    email: 'demo_user@example.com',
    password: 'demo_user',
    profileType: 'member',
  },
  'beta-tester': {
    createdAt: new Date('2022-01-30T18:51:57.719Z'),
    displayName: 'demo_beta_tester',
    username: 'demo_beta_tester',
    roles: [UserRole.BETA_TESTER],
    email: 'demo_beta_tester@example.com',
    password: 'demo_beta_tester',
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    lastActive: new Date('2022-01-30T18:51:57.719Z'),
    profileType: 'member',
  },
  admin: {
    createdAt: new Date('2022-01-30T18:51:57.719Z'),
    displayName: 'demo_admin',
    username: 'demo_admin',
    roles: [UserRole.ADMIN],
    email: 'demo_admin@example.com',
    password: 'demo_admin',
    about: 'admin',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  event_reader: {
    username: 'event_reader',
    createdAt: new Date('2019-08-15T00:00:00.000Z'),
    displayName: 'event_reader',
    email: 'event_reader@test.com',
    password: 'test1234',
    roles: [UserRole.BETA_TESTER],
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  howto_creator: {
    email: 'howto_creator@test.com',
    username: 'howto_creator',
    password: 'test1234',
    createdAt: new Date('2020-01-07T15:46:00.297Z'),
    displayName: 'howto_creator',
    roles: [],
    about: 'howto_creator stuff',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  research_creator: {
    email: 'research_creator@test.com',
    password: 'research_creator',
    username: 'research_creator',
    createdAt: new Date('2020-01-07T15:46:00.297Z'),
    displayName: 'research_creator',
    roles: [UserRole.RESEARCH_CREATOR],
    about: 'research_creator research_creator',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  settings_machine_new: {
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: 'svg',
      },
    ],
    createdAt: new Date('2020-01-07T12:14:50.354Z'),
    displayName: 'settings_machine_new',
    email: 'settings_machine_new@test.com',
    username: 'settings_machine_new',
    password: 'settings_machine_new',
    roles: [],
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'machine-builder',
  },
  settings_member_new: {
    country: 'Poland',
    username: 'settings_member_new',
    email: 'settings_member_new@test.com',
    password: 'test1234',
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: 'svg',
      },
    ],
    createdAt: new Date('2020-01-07T12:14:30.030Z'),
    displayName: 'settings_member_new',
    roles: [],
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  settings_workplace_empty: {
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: 'svg',
      },
    ],
    createdAt: new Date('2020-01-07T12:15:42.218Z'),
    displayName: 'settings_workplace_empty',
    username: 'settings_workplace_empty',
    email: 'settings_workplace_empty@test.com',
    password: 'settings_workplace_empty',
    id: 13,
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'workspace',
  },
  settings_workplace_new: {
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: 'svg',
      },
    ],
    createdAt: new Date('2020-01-07T12:14:15.081Z'),
    displayName: 'settings_workplace_new',
    username: 'settings_workplace_new',
    website: 'http://settings_workplace_new.example.com',
    id: 14,
    email: 'settings_workplace_new@test.com',
    password: 'test1234',
    roles: [UserRole.BETA_TESTER],
    impact: {
      2022: [
        {
          id: 'plastic',
          value: 43000,
          isVisible: true,
        },
        {
          id: 'revenue',
          value: 36000,
          isVisible: true,
        },
        {
          id: 'employees',
          value: 3,
          isVisible: true,
        },
        {
          id: 'volunteers',
          value: 45,
          isVisible: false,
        },
        {
          id: 'machines',
          value: 2,
          isVisible: true,
        },
      ],
    },
    isContactable: false,
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'workspace',
  },
  mapview_testing_rejected: {
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: 'svg',
      },
    ],
    createdAt: new Date('2020-01-07T12:14:15.081Z'),
    displayName: 'mapview_testing_rejected',
    username: 'mapview_testing_rejected',
    id: 15,
    email: 'mapview_testing_rejected@test.com',
    password: 'mapview_testing_rejected@test.com',
    roles: [],
    about: '',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
  profile_views: {
    id: 16,
    createdAt: new Date('2022-01-30T18:51:57.719Z'),
    displayName: 'profile_views',
    username: 'profile_views',
    email: 'profile_views@test.com',
    password: 'test1234',
    roles: [],
    coverImages: [
      {
        id: '',
        publicUrl: 'uploads/v3_users/demo_user/images/profile-cover-1.jpg',
      },
    ],
    website: 'http://profile_views.example.com',
    about: 'Hi! I have 99 views',
    country: 'nl',
    photo: {
      id: 'string',
      publicUrl: 'string',
    },
    profileType: 'member',
  },
}
