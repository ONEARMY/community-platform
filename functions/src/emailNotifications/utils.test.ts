import * as utils from './utils'

import { firebaseAuth } from '../Firebase/auth'
import {
  errors,
  isBelowMessageLimit,
  isReceiverContactable,
  isSameEmail,
  isUserAllowedToMessage,
  isValidMessageRequest,
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

describe('isBelowMessageLimit', () => {
  it("returns true if user hasn't reached message cap", async () => {
    messageDocs.length = 99

    await expect(isBelowMessageLimit('jeff@email.com')).resolves.toEqual(true)
  })

  it('errors when user has reached message cap', async () => {
    messageDocs.length = 100

    await expect(isBelowMessageLimit('jeff@email.com')).rejects.toThrowError(
      errors.MESSAGE_LIMIT,
    )
  })
})

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

describe('isValidMessageRequest', () => {
  it('returns true when all checks pass', async () => {
    const messageInput = {
      _id: '234dfsb',
      email: 'jeffery@gmail.com',
      text: 'Hi, can we be friends please?',
      toUserName: 'user_1',
      isSent: false,
    } as IMessageDB

    jest.spyOn(firebaseAuth, 'getUserByEmail').mockResolvedValue({
      email: 'jeffery@gmail.com',
      uid: 'asndyq',
    } as UserRecord)

    jest.spyOn(utils, 'isSameEmail').mockReturnValue(true)
    jest.spyOn(utils, 'isUserAllowedToMessage').mockResolvedValue(true)
    jest.spyOn(utils, 'isBelowMessageLimit').mockResolvedValue(true)
    jest.spyOn(utils, 'isReceiverContactable').mockResolvedValue(true)

    await expect(isValidMessageRequest(messageInput)).resolves.toEqual(true)
  })
})
