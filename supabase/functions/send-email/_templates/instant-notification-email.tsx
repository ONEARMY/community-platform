import React from 'react'
import { Link, Text } from '@react-email/components'

import { BoxText } from './components/box-text.tsx'
import { Button } from './components/button.tsx'
import { Layout } from './layout.tsx'
import { Heading } from './components/heading.tsx'

import type { Comment, News, Notification, TenantSettings } from 'oa-shared'
import { Header } from './components/header.tsx'

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

const setSourceContentLink = (
  notification: Notification,
  settings: TenantSettings,
) => {
  let path = `${settings.siteUrl}/${notification.sourceContentType}/${notification.sourceContent?.slug}`
  if (notification.sourceContentType == 'research') {
    path = path + `#update_${notification.parentContentId}`
  }

  return path
}

const setDeepLink = (
  notification: Notification,
  link: string,
  settings: TenantSettings,
) => {
  if (notification.sourceContentType == 'research') {
    // Have to rebuild the path as there's a weirdness to how deep linking into research update discussions works
    return `${settings.siteUrl}/research/${notification.sourceContent?.slug}?update_${notification.parentContentId}#comment:${notification.content?.id}`
  }
  return `${link}#comment:${notification.content?.id}`
}

export const InstantNotificationEmail = (props: IProps) => {
  const { notification, settings } = props

  const sourceContentLink = setSourceContentLink(notification, settings)
  const deepLink = setDeepLink(notification, sourceContentLink, settings)
  const preview = `New ${notification.contentType} notification on ${settings.siteName}`

  return (
    <Layout preview={preview} settings={settings}>
      <Header>
        <Link href={deepLink}>
          <Heading>
            New {notification.contentType} from{' '}
            <strong>{notification.triggeredBy?.username}</strong>{' '}
            {notification.sourceContent &&
              `on ${notification.sourceContent?.title}`}
            {notification.parentContent?.title &&
              `: ${notification.parentContent?.title}`}
          </Heading>
        </Link>
      </Header>

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
