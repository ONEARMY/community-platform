// Similar to src/.server/templates/Layout.tsx

import React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

const body = {
  backgroundColor: '#f4f6f7',
  fontFamily: 'Varela Round", Arial, sans-serif',
  fontSize: '14px',
  color: '#000000',
}

const card = {
  background: '#fff',
  border: '2px solid black',
  borderRadius: '15px',
  padding: '15px',
  margin: '0 auto',
}

const footer = {
  color: '#333',
  padding: '0 15px',
}

const wrapper = {
  width: '100%',
  maxWidth: '600px',
}

const settings = {
  siteName: 'Community Platform',
  messageSignOff: 'One Army',
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
        <Container style={wrapper}>
          <Container style={card}>
            <Section>
              <Img
                alt="One Army"
                height={85}
                width={85}
                src="https://community-platform-pr-4112.fly.dev/assets/img/one-army-logo.png"
              />
              {children}
              <p>
                Cheers,
                <br />
                {settings.messageSignOff}
              </p>
            </Section>
          </Container>
          <Text style={footer}>
            You got this because you're part of One Army. The{' '}
            <a href="https://www.fixing.fashion/" target="_blank">
              Fixing Fashion
            </a>
            ,{' '}
            <a href="https://www.preciousplastic.com/" target="_blank">
              Precious Plastic
            </a>{' '}
            and{' '}
            <a href="https://www.projectkamp.com/" target="_blank">
              Project Kamp
            </a>{' '}
            communities.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
