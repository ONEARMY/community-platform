import React from 'react'
import { Column, Link, Section, Text } from '@react-email/components'

import { BoxText } from './components/box-text.tsx'
import { Button } from './components/button.tsx'
import { Layout } from './layout.tsx'
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

  const buttonLink = `${settings.siteUrl}/${notification.title.parentSlug}`
  const headerLink = `${settings.siteUrl}/${notification.slug}`
  const preferencesUpdatePath = `${settings.siteUrl}/email-preferences?code=${user.code}`

  return (
    <Layout
      preferencesUpdatePath={preferencesUpdatePath}
      preview={notification.email.preview}
      settings={settings}
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
