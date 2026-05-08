import { Container, Text } from '@react-email/components';
import type { NotificationDisplay, TenantSettings } from 'oa-shared';
import { BoxText } from './components/box-text';
import { Button } from './components/button';
import { Header } from './components/header';
import { Heading } from './components/heading';
import { Layout, urlAppend } from './Layout';

const text = {
  color: '#686868',
  fontSize: '18px',
  lineHeight: '30px',
};

interface IProps {
  notification: NotificationDisplay;
  settings: TenantSettings;
  userCode: string;
}

export const InstantNotificationEmail = (props: IProps) => {
  const { notification, settings, userCode } = props;

  const buttonLink = urlAppend(`${settings.siteUrl}${notification.link}`, 'notification');

  return (
    <Layout
      emailType="notification"
      preview={notification.email.preview}
      settings={settings}
      userCode={userCode}
    >
      <Header>
        <Heading customStyle={{ padding: '0 20px' }}>
          {notification.triggeredBy} {notification.title}
        </Heading>
      </Header>

      <Container style={{ padding: '0 20px 20px 20px', margin: 0, maxWidth: '100%' }}>
        {notification.email.body ? (
          <Text style={text}>{notification.email.body}</Text>
        ) : (
          <>
            <Heading>They wrote:</Heading>
            <Text style={text}>{notification.body}</Text>
          </>
        )}
        <Button href={buttonLink}>{notification.email.buttonLabel} →</Button>
      </Container>
    </Layout>
  );
};
