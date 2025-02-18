// Similar to src/.server/templates/Layout.tsx

import React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from 'npm:@react-email/components@0.0.22'

const body = {
  backgroundColor: '#f4f6f7',
  fontFamily: 'Varela Round", Arial, sans-serif',
  fontSize: '14px',
  color: '#000000',
}

const card = {
  background: '#fff',
  border: '3px solid black',
  borderRadius: '15px',
  padding: '15px',
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
}

const settings = {
  siteName: 'Community Platform',
  siteImage: 'http://',
  messageSignOff: 'OneArmy Community Platform',
}

type LayoutArgs = {
  children: React.ReactNode
  preview: string
}

export const Layout = ({ children, preview }: LayoutArgs) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={card}>
          <Section>
            {children}
            <p>
              Cheers,
              <br />
              {settings.messageSignOff}
            </p>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
