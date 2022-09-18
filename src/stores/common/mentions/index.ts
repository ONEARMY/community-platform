import type { IUser } from 'src/models'
import { logger } from 'src/logger'
import type { UserStore } from '../../User/user.store'

/**
 * Filter text for `@username` and
 * change to a UserReference string for storage
 *
 * An example of this UserReference string is:
 * `@@{authId:username}`
 *
 * @param text string
 * @param userStore UserStore
 * @returns Promise<string>
 */
export const changeMentionToUserReference = async function (
  text: string,
  userStore: UserStore,
): Promise<string> {
  const mentions = text.match(/\B@[a-z0-9_-]+/g)
  const mentionedUsers = new Set<string>()

  if (!mentions) {
    return text
  }

  for (const mention of mentions) {
    const userProfile: IUser = await userStore.getUserProfile(
      mention.replace('@', ''),
    )

    logger.debug({ userProfile })

    if (userProfile) {
      text = text.replace(
        mention,
        `@@{${userProfile._authID}:${userProfile.userName}}`,
      )
      mentionedUsers.add(userProfile.userName)
    } else {
      logger.debug('Unable to find matching profile', { mention })
    }
  }
  return text
}

export const changeUserReferenceToPlainText = function (text: string) {
  return text.replace(/@@\{([A-Za-z0-9_-]+):([a-z0-9]+)}/g, '@$2')
}
