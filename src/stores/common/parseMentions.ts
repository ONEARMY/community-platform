import type { IUser } from 'src/models'
import { logger } from 'src/logger'
import type { UserStore } from '../User/user.store'

/**
 * 
 * @param text string
 * @param userStore UserStore
 * @returns Promise<{
 *   text: string;
 *   mentions: Set<string>
 * }>
 */
export const parseMentions = async function (
    text: string,
    userStore: UserStore,
): Promise<{ text: string; mentionedUsers: Set<string> }> {
    // Regex 
    const mentions = text.match(/\B@[a-z0-9_-]+/g)
    const mentionedUsers = new Set<string>()

    if (!mentions) {
        return {
            text,
            mentionedUsers,
        }
    }
    for (const mention of mentions) {
        const userProfile: IUser = await userStore.getUserProfile(
            mention.replace('@', ''),
        )

        console.log({userProfile});

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
    return { text, mentionedUsers }
}
