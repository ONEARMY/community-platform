import { Column, Html, Img, Markdown, Row, Text } from '@react-email/components';
import type { NotificationDisplay, TenantSettings } from 'oa-shared';
import { BoxText } from './components/box-text';
import { Button } from './components/button';
import { ButtonCallToAction } from './components/button-call-to-action';
import { Header } from './components/header';
import { Heading } from './components/heading';
import { Layout, urlAppend } from './Layout';

interface IProps {
  notification: NotificationDisplay;
  settings: TenantSettings;
  userCode: string;
  isPreview?: boolean;
}

const markdownCustomStyles = {
  img: { maxWidth: '500px', width: '100%' },
  p: { lineHeight: '1.5em' },
};

const markdownContainerStyles = {
  maxWidth: '500px',
};

export const NewsEmail = (props: IProps) => {
  const { notification, settings, userCode, isPreview } = props;

  const buttonLink = urlAppend(`${settings.siteUrl}${notification.link}`, 'notification');
  const commentButtonLink = urlAppend(
    `${settings.siteUrl}${notification.link}#discussion`,
    'notification',
  );
  const preview = isPreview ? `Preview: ${notification.email.preview}` : notification.email.preview;

  const buttonStyle = {
    backgroundColor: '#E2EDF7',
    border: 0,
    borderRadius: '8px',
    color: '#27272c',
    fontSize: '12px',
    padding: '8px 16px',
  };

  return (
    <Layout emailType="notification" preview={preview} settings={settings} userCode={userCode}>
      {isPreview && (
        <BoxText>
          <Text>
            PREVIEW: Remember, things might not fully work correctly (e.g. links if you haven't
            saved the news as a draft yet)
          </Text>
        </BoxText>
      )}

      <Header>
        <Img
          src={notification.email.heroImage}
          alt={notification.title}
          style={{ maxWidth: '500px' }}
        />
        <Heading>{notification.title}</Heading>
        {notification.email.displayDate && (
          <Heading as="h4" customStyle={{ color: '#696969' }}>
            {notification.email.displayDate}
          </Heading>
        )}
      </Header>

      <Row>
        <Column>
          <table>
            <tr>
              <td style={{ paddingRight: '12px' }}>
                <Button href={commentButtonLink} customStyle={buttonStyle}>
                  <Img
                    alt=""
                    height="15px"
                    src="https://community.preciousplastic.com/assets/icon-comment-N7-BVPWS.svg"
                    width="15px"
                  />
                </Button>
              </td>
              <td>
                <Button href={buttonLink} customStyle={buttonStyle}>
                  {notification.email.buttonLabel}
                </Button>
              </td>
            </tr>
          </table>
        </Column>
      </Row>

      <Html>
        <Markdown
          markdownCustomStyles={markdownCustomStyles}
          markdownContainerStyles={markdownContainerStyles}
        >
          {notification.email.body!}
        </Markdown>
      </Html>

      <ButtonCallToAction href={commentButtonLink} />
    </Layout>
  );
};
