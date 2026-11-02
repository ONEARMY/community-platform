import type { JSONContent } from '@tiptap/core';
import type { TenantSettings } from 'oa-shared';
import { Container } from 'react-email';
import { Layout } from './Layout';
import { renderTiptapEmail } from './renderTiptapEmail';

interface IProps {
  content: JSONContent;
  preview: string;
  settings: TenantSettings;
}

export const WelcomeEmail = ({ content, preview, settings }: IProps) => (
  <Layout emailType="service" preview={preview} settings={settings}>
    <Container style={{ padding: '20px', lineHeight: 1.5, margin: 0, maxWidth: '100%' }}>
      {renderTiptapEmail(content)}
    </Container>
  </Layout>
);
