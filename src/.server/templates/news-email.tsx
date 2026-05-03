import { Column, Container, Html, Img, Markdown, Row, Text } from '@react-email/components';
import { CSSProperties } from '@theme-ui/core';
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

export const NewsEmail = (props: IProps) => {
  const { notification, settings, userCode, isPreview } = props;

  const buttonLink = urlAppend(`${settings.siteUrl}${notification.link}`, 'notification');
  const commentButtonLink = urlAppend(
    `${settings.siteUrl}${notification.link}#discussion`,
    'notification',
  );
  const buttonStyle: CSSProperties = {
    backgroundColor: '#E2EDF7',
    border: 0,
    borderRadius: '8px',
    color: '#27272c',
    fontSize: '12px',
    padding: '8px 16px',
  };

  return (
    <Layout
      emailType="notification"
      preview={notification.email.preview}
      settings={settings}
      userCode={userCode}
    >
      <Img
        src={notification.email.heroImage}
        alt={notification.title}
        style={{
          width: '100%',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          maxHeight: '345px',
          objectFit: 'cover',
        }}
      />
      <Header>
        <Heading customStyle={{ padding: '0 20px' }}>{notification.title}</Heading>
        {notification.email.displayDate && (
          <Heading as="h4" customStyle={{ color: '#696969', padding: '0 20px' }}>
            {notification.email.displayDate}
          </Heading>
        )}
      </Header>

      <Container style={{ padding: '0 20px 20px 20px', margin: 0, maxWidth: '100%' }}>
        {isPreview && (
          <BoxText>
            <Text>PREVIEW: if you haven't saved the news as a draft yet, links will not work.</Text>
          </BoxText>
        )}

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
            markdownCustomStyles={{
              image: { width: '100%', borderRadius: '10px' },
              p: { lineHeight: '2' },
              li: { lineHeight: '2' },
              h1: {
                lineHeight: '1.2',
              },
              h2: {
                lineHeight: '1.2',
              },
              h3: {
                lineHeight: '1.2',
              },
              h4: {
                lineHeight: '1.2',
              },
              h5: {
                lineHeight: '1.2',
              },
              h6: {
                lineHeight: '1.2',
              },
              blockQuote: {
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '10px',
                paddingBottom: '10px',
                backgroundColor: '#f4f8fd',
                borderLeft: '3px solid #c8d8ec',
                margin: 0,
              },
            }}
          >
            {notification.email.body!}
          </Markdown>
        </Html>
        <ButtonCallToAction href={commentButtonLink} />
      </Container>
    </Layout>
  );
};
