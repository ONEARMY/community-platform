import { Body, Container, Head, Html, Img, Preview, Section } from '@react-email/components';
import { MessageSettings } from '../models/messageSettings';

import type { ReactNode } from 'react';

const body = {
  backgroundColor: '#f4f6f7',
  fontFamily: 'Varela Round", Arial, sans-serif',
  fontSize: '14px',
  color: '#000000',
};

const card = {
  background: '#fff',
  border: '2px solid black',
  borderRadius: '15px',
  padding: '15px',
  margin: '0 auto',
};

const wrapper = {
  maxWidth: '600px',
};

type LayoutArgs = {
  children: ReactNode;
  settings: MessageSettings;
  preview: string;
};

export default function Layout({ children, settings, preview }: LayoutArgs) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={wrapper}>
          <Container style={card}>
            <Section>
              <Img width="85" alt={settings.siteName} src={settings.siteImage} />

              {children}
              <p>
                Cheers,
                <br />
                {settings.messageSignOff}
              </p>
            </Section>
          </Container>
          <Container style={wrapper}>
            <p style={{ textAlign: 'center' }}>
              You've received this because you're opted in to be contacted by other community
              members. If you want to opt out,{' '}
              <a href={settings.siteUrl + '/settings'}>change that here</a>.
            </p>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}
