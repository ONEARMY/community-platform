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

type LayoutArgs = {
  children: React.ReactNode
  preferencesUpdatePath: string
  preview: string
  settings: TenantSettings
}

export const Layout = (props: LayoutArgs) => {
  const { children, preferencesUpdatePath, preview, settings } = props

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
            You are receiving important community updates by default. <br />
            You can update your{' '}
            <Link href={preferencesUpdatePath} style={link}>
              {' '}
              email preferences anytime
            </Link>{' '}
            or unsubscribe with ease. <br />
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
