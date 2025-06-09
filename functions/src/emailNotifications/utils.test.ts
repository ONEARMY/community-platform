import * as utils from './utils'

import {
  errors,
  isReceiverContactable,
  isSameEmail,
  isUserAllowedToMessage,
} from './utils'

import type { UserRecord } from 'firebase-admin/auth'
import { IUserDB } from 'oa-shared/models/user'
import { IMessageDB } from 'oa-shared/models/messages'

const messageDocs = []
let isBlockedFromMessaging = false

jest.mock('../Firebase/firestoreDB', () => ({
  db: {
    collection: () => ({
      where: () => ({
        get: () => ({
          docs: messageDocs,
        }),
        limit: () => ({
          get: () => ({
            docs: [
              {
                data: () => {
                  return { isBlockedFromMessaging }
                },
              },
            ],
          }),
        }),
      }),
    }),
  },
}))

jest.mock('../config/config', () => ({
  CONFIG: {
    deployment: {
      site_url: 'https://community.preciousplastic.com',
    },
  },
}))

describe('isReceiverContactable', () => {
  it('returns true when user is contactable', async () => {
    jest.spyOn(utils, 'getUserAndEmail').mockResolvedValue({
      toUser: { isContactableByPublic: true } as IUserDB,
      toUserEmail: 'anything@email.com',
    })

    await expect(isReceiverContactable('uid')).resolves.toEqual(true)
  })

  it("returns true when contactable value isn't specified", async () => {
    jest.spyOn(utils, 'getUserAndEmail').mockResolvedValue({
      toUser: {} as IUserDB,
      toUserEmail: 'anything@email.com',
    })

    await expect(isReceiverContactable('uid')).resolves.toEqual(true)
  })

  it("errors when user isn't contactable", async () => {
    jest.spyOn(utils, 'getUserAndEmail').mockResolvedValue({
      toUser: { isContactableByPublic: false } as IUserDB,
      toUserEmail: 'anything@email.com',
    })

    await expect(isReceiverContactable('uid')).rejects.toThrowError(
      errors.PROFILE_NOT_CONTACTABLE,
    )
  })
})

describe('isSameEmail', () => {
  it('returns true when emails provided are the same', () => {
    const email = 'same@email.com'
    const userDoc = { email }

    expect(isSameEmail(userDoc, email)).toEqual(true)
  })

  it('errors when emails provided are different', () => {
    const email = 'a@email.com'
    const userDoc = { email: 'b@email.com' }

    expect(() => {
      isSameEmail(userDoc, email)
    }).toThrowError(errors.NO_ATTACHED_USER)
  })
})

describe('isUserAllowedToMessage', () => {
  it("returns true when user isn't blocked from messaging", async () => {
    await expect(isUserAllowedToMessage('userName')).resolves.toEqual(true)
  })

  it('errors when user is blocked from messaging', async () => {
    isBlockedFromMessaging = true

    await expect(isUserAllowedToMessage('userName')).rejects.toThrowError(
      errors.USER_BLOCKED,
    )
  })
})
