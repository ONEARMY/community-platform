// Similar to src/.server/templates/Layout.tsx

import React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
} from '@react-email/components'

import { Footer } from './components/footer.tsx'

import type { TenantSettings } from 'oa-shared'

const body = {
  backgroundColor: '#f4f6f7',
  fontFamily: '"Varela Round", Arial, sans-serif',
  fontSize: '14px',
  color: '#000000',
  maxWidth: '100%',
}

const card = {
  background: '#fff',
  border: '2px solid black',
  borderRadius: '15px',
  padding: '20px',
  margin: '0 auto',
}

const link = {
  color: '#27272c',
  fontWeight: 'bold',
  textDecoration: 'underline',
}

const mainContainer = {
  maxWidth: '100%',
  width: '600px',
}

type EmailType = 'service' | 'moderation' | 'notification'

type LayoutArgs = {
  children: React.ReactNode
  emailType: EmailType
  preview: string
  settings: TenantSettings
  userCode?: string
}

export const urlAppend = (path: string, emailType: EmailType) => {
  const url = new URL(`${path}`)
  url.searchParams.append('utm_source', emailType)
  url.searchParams.append('utm_medium', 'email')
  return url.toString()
}

export const Layout = (props: LayoutArgs) => {
  const { children, emailType, preview, settings, userCode } = props

  const basePreferencesPath = userCode
    ? `${settings.siteUrl}/email-preferences?code=${userCode}`
    : `${settings.siteUrl}/settings/notifications`
  const preferencesUpdatePath = urlAppend(basePreferencesPath, emailType)

  const isNotificationEmail = emailType === 'notification'

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={mainContainer}>
          <Img
            alt={settings.siteName}
            height="85px"
            width="85px"
            src={settings.siteImage}
            style={{ margin: '30px auto' }}
          />
          <Section style={card}>{children}</Section>
          <Footer>
            You must receive important community messages. <br />
            {isNotificationEmail && (
              <>
                <Link href={preferencesUpdatePath} style={link}>
                  Unsubscribe or update your email preferences.
                </Link>
                <br />
              </>
            )}
            Something is not right? Send us{' '}
            <Link
              href={`${settings.siteUrl}/feedback/#page=email`}
              style={link}
            >
              feedback
            </Link>
            .
          </Footer>
        </Container>
      </Body>
    </Html>
  )
}
