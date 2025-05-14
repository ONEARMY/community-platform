import React from 'react'
import { Link, Text } from '@react-email/components'

import { BoxText } from './components/box-text.tsx'
import { Button } from './components/button.tsx'
import { Layout } from './layout.tsx'
import { Heading } from './components/heading.tsx'

import type { Comment, News, Notification, TenantSettings } from 'oa-shared'
import { ParentBox } from './components/parent-box.tsx'

const text = {
  color: '#686868',
  fontSize: '18px',
  lineHeight: '30px',
  whiteSpace: 'pre',
}

interface IProps {
  notification: Notification
  settings: TenantSettings
}

// Some unavoidable duplication of approaches here to:
// packages/components/src/NotificationListSupabase

export const InstantNotificationEmail = (props: IProps) => {
  const { notification, settings } = props

  const sourceContentLink = `${settings.siteUrl}/${notification.sourceContentType}/${
    (notification.sourceContent as News).slug
  }`
  const href = `${sourceContentLink}#comment:${notification.content?.id}`
  const preview = `New ${notification.contentType} notification on ${settings.siteName}`

  const parentComment =
    notification.parentContent?.comment.substring(0, 50) + '...'

  return (
    <Layout preview={preview} settings={settings}>
      <Link href={href}>
        <Heading>
          New {notification.contentType} from{' '}
          <strong>{notification.triggeredBy?.username}</strong>{' '}
          {notification.sourceContent &&
            `on ${notification.sourceContent?.title}`}
        </Heading>
      </Link>
      {notification.parentContent && <ParentBox>{parentComment}</ParentBox>}

      <BoxText>
        <Heading>They wrote:</Heading>
        <Text style={text}>
          {(notification.content as unknown as Comment)?.comment}
        </Text>
      </BoxText>
      <Button href={sourceContentLink}>See the full discussion →</Button>
    </Layout>
  )
}
