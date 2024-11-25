import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { DB_ENDPOINTS } from 'oa-shared'
import { firestore } from 'src/utils/firebase'
import { randomID } from 'src/utils/helpers'

import { userService } from './user.service'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { INotification, IUserDB, NotificationType } from 'oa-shared'
import type { DBComment } from 'src/models/comment.model'
import type { DBProfile } from 'src/models/profile.model'

const sendCommentNotification = async (
  client: SupabaseClient,
  comment: DBComment,
  triggeredBy: DBProfile,
) => {
  const { url, title, createdBy } = await _getSourceData(
    comment.source_type!,
    comment.source_id_legacy!,
  )

  const authorsResult = await client.rpc(
    'comment_authors_by_source_id_legacy',
    {
      source_id_legacy_input: comment.source_id_legacy,
    },
  )

  const recipientsToNotify = new Set<string>(authorsResult.data)
  recipientsToNotify.add(createdBy)
  recipientsToNotify.delete(triggeredBy.username) // don't send notification to who triggered it

  const urlWithDeepLink = `${url}#comment:${comment.id}`

  return await Promise.all(
    Array.from(recipientsToNotify).map((recipient) => {
      _triggerNotification(
        recipient,
        'new_comment_discussion',
        title,
        triggeredBy,
        urlWithDeepLink,
      )
    }),
  )
}

const _getSourceData = async (sourceType: string, sourceId: string) => {
  const sourceItem = await getDoc(
    doc(firestore, DB_ENDPOINTS[sourceType], sourceId),
  )

  const parentPath = sourceType === 'howtos' ? 'how-to' : sourceType

  const item = sourceItem.data()

  return {
    url: `/${parentPath}/${item?.slug}`,
    title: item?.title,
    createdBy: item?._createdBy,
  }
}

const _triggerNotification = async (
  targetUserUsername: string,
  type: NotificationType,
  title: string,
  triggeredBy: DBProfile,
  relevantUrl: string,
) => {
  try {
    const newNotification: INotification = {
      _id: randomID(),
      _created: new Date().toISOString(),
      triggeredBy: {
        displayName: triggeredBy.display_name,
        userId: triggeredBy.username,
      },
      relevantUrl,
      type,
      title,
      read: false,
      notified: false,
    }

    const user = await userService.getById(targetUserUsername)

    if (!user) {
      return console.error('User not found.', { newNotification })
    }
    const notifications = user.notifications
      ? [...user.notifications, newNotification]
      : [newNotification]

    await _updateUserNotifications(user, notifications)
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

const _updateUserNotifications = async (
  user: IUserDB,
  notifications: INotification[],
) => {
  const dbRef = doc(firestore, DB_ENDPOINTS.users, user._id)

  await updateDoc(dbRef, {
    _id: user.userName,
    notifications,
  })
}

export const notificationsService = {
  sendCommentNotification,
}
