import { doc, updateDoc } from 'firebase/firestore'
import { DB_ENDPOINTS } from 'oa-shared'
import { firestore } from 'src/utils/firebase'
import { randomID } from 'src/utils/helpers'

import { userService } from './userService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBComment,
  DBProfile,
  DBQuestion,
  DBResearchItem,
  DBResearchUpdate,
  INotification,
  IUserDB,
  NotificationType,
} from 'oa-shared'

const sendCommentNotification = async (
  client: SupabaseClient,
  comment: DBComment,
  triggeredBy: DBProfile,
) => {
  const { url, title, createdBy } = await _getSourceData(
    client,
    comment.source_type!,
    comment.source_id!,
  )

  const authorsResult = await client.rpc('comment_authors_by_source_id', {
    source_id_input: comment.source_id,
  })

  const recipientsToNotify = new Set<string>(authorsResult.data)
  if (createdBy) {
    recipientsToNotify.add(createdBy)
  }
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

const sendResearchUpdateNotification = async (
  client: SupabaseClient,
  research: DBResearchItem,
  researchUpdate: DBResearchUpdate,
  triggeredBy: DBProfile,
) => {
  // The join creates an incorrect type, so going to any
  const { data }: { data: any[] | null } = await client
    .from('subscribers')
    .select('id, user:profiles(username)')
    .eq('content_id', researchUpdate.research_id)
    .eq('content_type', 'research')

  const profileIds = data?.map((subscriber) => subscriber.user.username).flat()

  const recipientsToNotify = new Set<string>(profileIds)
  if (researchUpdate.created_by) {
    recipientsToNotify.add(researchUpdate.created_by.toString())
  }

  const url = `/research/${research.slug}/#update_${researchUpdate.id}`

  Promise.all(
    Array.from(recipientsToNotify).map((recipient) => {
      _triggerNotification(
        recipient,
        'research_update',
        researchUpdate.title,
        triggeredBy,
        url,
      )
    }),
  )

  return
}

const _getSourceData = async (
  client: SupabaseClient,
  sourceType: string,
  sourceId: number,
) => {
  const itemResult = await client
    .from(sourceType)
    .select('id,slug,title,created_by,author:profiles(id,username)')
    .eq('id', sourceId)
    .single()
  const item = itemResult.data as unknown as DBQuestion
  const parentPath = sourceType === 'projects' ? 'library' : sourceType

  return {
    url: `/${parentPath}/${item?.slug}`,
    title: item?.title,
    createdBy: item?.author?.username,
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
    ...user,
    notifications,
  })
}

export const notificationsService = {
  sendCommentNotification,
  sendResearchUpdateNotification,
}
