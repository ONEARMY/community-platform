import { Text } from '@react-email/components';

import { Header } from './components/header';
import { BoxText } from './components/box-text';
import { Button } from './components/button';
import { Heading } from './components/heading';
import { Layout, urlAppend } from './Layout';
import type { NotificationDisplay, TenantSettings } from 'oa-shared';

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
        <Heading>
          {notification.triggeredBy} {notification.title}
        </Heading>
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
  );
};
