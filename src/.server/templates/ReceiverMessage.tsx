import Layout from './Layout'
import { MessageSettings } from '../models/messageSettings'

type ReceiverMessageArgs = {
  messengerEmailAddress: string
  messengerName: string | undefined
  messengerUsername: string
  receiverName: string
  settings: MessageSettings
  text: string
}

export default function ReceiverMessage(props: ReceiverMessageArgs) {
  const {
    receiverName,
    settings,
    text,
    messengerEmailAddress,
    messengerName,
    messengerUsername,
  } = props

  const isMessengerName = messengerName && messengerName !== 'undefined'
  const name = isMessengerName ? messengerName : messengerUsername

  const preview = `${name} wants to chat to you!`

  return (
    <Layout preview={preview} settings={settings}>
      <p>Hey {receiverName},</p>
      <p>
        <a href={`${settings.siteUrl}/u/${messengerUsername}`}>{name}</a> has
        sent you a message through{' '}
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
    </Layout>
  )
}
