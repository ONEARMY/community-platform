import { Body, Container, Head, Html, Img, Preview, Section } from '@react-email/components';
import { MessageSettings } from '../models/messageSettings';

type ReceiverMessageArgs = {
  messengerEmailAddress: string;
  messengerName: string | undefined;
  messengerUsername: string;
  receiverName: string;
  settings: MessageSettings;
  text: string;
};

export default function ReceiverMessage({
  receiverName,
  settings,
  text,
  messengerEmailAddress,
  messengerName,
  messengerUsername,
}: ReceiverMessageArgs) {
  const isMessengerName = messengerName && messengerName !== 'undefined';
  const name = isMessengerName ? messengerName : messengerUsername;

  const preview = `${name} wants to chat to you!`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: '#f4f6f7',
          fontFamily: 'Varela Round", Arial, sans-serif',
          fontSize: '14px',
          color: '#000000',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
          }}
        >
          <Container
            style={{
              background: '#fff',
              border: '2px solid black',
              borderRadius: '15px',
              padding: '15px',
              margin: '0 auto',
            }}
          >
            <Section>
              <Img width="85" alt={settings.siteName} src={settings.siteImage} />
              <p>Hey {receiverName},</p>
              <p>
                <a href={`${settings.siteUrl}/u/${messengerUsername}`}>{name}</a> has sent you a
                message through{' '}
                <a href={settings.siteUrl} target="_blank">
                  {settings.siteName}
                </a>
                .
              </p>
              <p>Please reply directly to their email: {messengerEmailAddress}.</p>
              ---
              <p>
                <strong>{text}</strong>
              </p>
              ---
              <p>
                Cheers,
                <br />
                {settings.messageSignOff}
              </p>
            </Section>
          </Container>
          <Container
            style={{
              maxWidth: '600px',
            }}
          >
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
