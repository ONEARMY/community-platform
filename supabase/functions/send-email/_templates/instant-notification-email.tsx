import React from 'react'
import { Link, Text } from '@react-email/components'

import { BoxText } from './components/box-text.tsx'
import { Button } from './components/button.tsx'
import { Layout } from './layout.tsx'
import { Heading } from './components/heading.tsx'

import type { NotificationDisplay, TenantSettings } from 'oa-shared'
import { Header } from './components/header.tsx'

const text = {
  color: '#686868',
  fontSize: '18px',
  lineHeight: '30px',
  whiteSpace: 'pre',
}

interface IProps {
  notification: NotificationDisplay
  settings: TenantSettings
}

// Some unavoidable duplication of approaches here to:
// packages/components/src/NotificationListSupabase

export const InstantNotificationEmail = (props: IProps) => {
  const { notification, settings } = props

  const headerLink = `${settings.siteUrl}/${notification.slug}`
  const buttonLink = `${settings.siteUrl}/${notification.title.parentSlug}`
  const preview = `New ${notification.contentType} notification on ${settings.siteName}`

  return (
    <Layout preview={preview} settings={settings}>
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
        <Heading>They wrote:</Heading>
        <Text style={text}>{notification.body}</Text>
      </BoxText>
      <Button href={buttonLink}>See the full discussion →</Button>
    </Layout>
  )
}
