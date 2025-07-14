import React from 'react'
import { Column, Link, Section, Text } from '@react-email/components'

import { BoxText } from './components/box-text.tsx'
import { Button } from './components/button.tsx'
import { Layout, urlAppend } from './layout.tsx'
import { Heading } from './components/heading.tsx'

import type {
  NotificationDisplay,
  TenantSettings,
  UserEmailData,
} from 'oa-shared'
import { Header } from './components/header.tsx'

const text = {
  color: '#686868',
  fontSize: '18px',
  lineHeight: '30px',
}

interface IProps {
  notification: NotificationDisplay
  settings: TenantSettings
  user: UserEmailData
}

// Some unavoidable duplication of approaches here to:
// packages/components/src/NotificationListSupabase

export const InstantNotificationEmail = (props: IProps) => {
  const { notification, settings, user } = props

  const buttonLink = urlAppend(
    `${settings.siteUrl}/${notification.title.parentSlug}`,
    'notification',
  )
  const headerLink = urlAppend(
    `${settings.siteUrl}/${notification.slug}`,
    'notification',
  )

  return (
    <Layout
      emailType="notification"
      preview={notification.email.preview}
      settings={settings}
      userCode={user.code}
    >
      <Header>
        <Link href={headerLink}>
          <Heading>
            <strong>{notification.title.triggeredBy}</strong>{' '}
            {notification.title.middle} {' on '}
            {notification.title.parentTitle}
          </Heading>
        </Link>
      </Header>

      <BoxText>
        {notification.email.body ? (
          <Text style={text}>{notification.email.body}</Text>
        ) : (
          <>
            <Heading>They wrote:</Heading>
            <Text style={text}>{notification.body}</Text>
          </>
        )}
      </BoxText>
      <Button href={buttonLink}>{notification.email.buttonLabel} →</Button>
    </Layout>
  )
}
