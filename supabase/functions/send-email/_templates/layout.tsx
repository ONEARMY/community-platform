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
  maxWidth: '600px',
}

const wrapper = {
  backgroundColor: '#f4f6f7',
  maxWidth: 'none',
  width: '100%',
}

type LayoutArgs = {
  children: React.ReactNode
  preview: string
  settings: TenantSettings
}

export const Layout = ({ children, preview, settings }: LayoutArgs) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={wrapper}>
          <Container style={mainContainer}>
            <Img
              alt={settings.siteName}
              height={85}
              width={85}
              src={settings.siteImage}
              style={{ margin: '30px auto' }}
            />
            <Container style={card}>
              <Section>{children}</Section>
            </Container>
            <Footer>
              You are receiving important community updates by default. <br />
              You can update your{' '}
              <Link
                href={`${settings.siteUrl}/settings/notifications`}
                style={link}
              >
                {' '}
                email preferences anytime
              </Link>{' '}
              or unsubscribe with ease. <br />
              Something is not right? Send us{' '}
              <Link
                href={
                  'https://onearmy.retool.com/form/c48a8f5a-4f53-4c58-adda-ef4f3cd8dee1#page=email'
                }
                style={link}
              >
                feedback
              </Link>
              .
            </Footer>
          </Container>
        </Container>
      </Body>
    </Html>
  )
}
