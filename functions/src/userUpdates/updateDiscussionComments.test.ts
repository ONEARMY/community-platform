import { updateDiscussionComments } from './updateDiscussionComments'

import type { IUserDB } from 'oa-shared/models/user'

const prevUser = {
  _id: 'hjg235z',
  location: { countryCode: 'UK' },
  userImage: {
    downloadUrl: 'https://avatars.githubusercontent.com/u/16688508',
  },
  badges: {
    verified: true,
  },
} as IUserDB

const userComment = {
  _id: 'commentId',
  _creatorId: prevUser._id,
  creatorName: prevUser.displayName,
  creatorCountry: prevUser.location.countryCode,
  creatorImage: prevUser.userImage.downloadUrl,
  isUserVerified: prevUser.badges.verified,
  comment: 'Great Post',
}

const discussion = {
  _id: 'DissIDD',
  contributorIds: [prevUser._id, 'afdg9731'],
  comments: [userComment],
}

const updateMock = jest.fn()
const snapshot = (discussion) => ({
  docs: [
    {
      data: () => discussion,
      ref: {
        update: (data) => updateMock(data),
      },
    },
  ],
})

const getMock = jest.fn()
jest.mock('../Firebase/firestoreDB', () => ({
  db: {
    collection: () => ({
      where: () => ({
        get: () => getMock(),
      }),
    }),
  },
}))

describe('updateDiscussionComments', () => {
  it('returns stright away if no user details have changed', () => {
    const user = { ...prevUser } as IUserDB

    updateDiscussionComments(prevUser, user)

    expect(getMock).not.toHaveBeenCalled()
  })

  it('updates the discussion comments with the new user details', async () => {
    const user = {
      ...prevUser,
      location: { countryCode: 'New' },
      userImage: {
        downloadUrl: 'https://avatars.githubusercontent.com/u/13672737?v=4',
      },

      badges: {
        verified: false,
        supporter: true,
      },
    } as IUserDB

    getMock.mockResolvedValue(snapshot(discussion))

    await updateDiscussionComments(prevUser, user)

    const expectedUpdatedComment = expect.objectContaining({
      creatorCountry: user.location.countryCode,
      creatorImage: user.userImage.downloadUrl,
      isUserVerified: user.badges.verified,
      isUserSupporter: user.badges.supporter,
    })

    expect(updateMock).toHaveBeenCalledWith({
      comments: [expectedUpdatedComment],
    })
  })
})
