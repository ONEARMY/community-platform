/* eslint-disable no-irregular-whitespace */
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
 * @returns Promise<{
 *   text: string;
 *   mentionedUsers: string[],
 * }>
 */
export const changeMentionToUserReference = async (
  text: string,
  userStore: UserStore,
): Promise<{
  text: string
  mentionedUsers: string[]
}> => {
  const mentions = text.match(/\B@[​a-z0-9_-]+/g)
  const mentionedUsers = new Set<string>()

  if (!mentions) {
    return { text, mentionedUsers: [] }
  }

  for (const mention of mentions) {
    const foundUseProfile: IUser = await userStore.getUserProfile(
      mention.replace(/[@​]/g, ''),
    )

    logger.debug({ userProfile: foundUseProfile })

    if (foundUseProfile) {
      text = text.replace(
        mention,
        `@@{${foundUseProfile._authID}:${foundUseProfile.userName}}`,
      )
      mentionedUsers.add(foundUseProfile.userName)
    } else {
      text = text.replace(mention, '@​' + mention.slice(1))
      logger.debug('Unable to find matching profile', { mention })
    }
  }
  return { text, mentionedUsers: Array.from(mentionedUsers) }
}

export const changeUserReferenceToPlainText = (text: string) =>
  text
    .replace(/@([A-Za-z0-9_-]+)/, '@​$1')
    .replace(/@@\{([A-Za-z0-9_-]+):([a-z0-9_-]+)}/g, '@$2')
