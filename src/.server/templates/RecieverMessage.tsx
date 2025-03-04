import Layout from './Layout'
import { MessageSettings } from '../models/messageSettings'

type RecieverMessageArgs = {
  email: string
  fromUser: string
  settings: MessageSettings
  text: string
  toUserName: string
  name: string | undefined
}

export default function RecieverMessage(props: RecieverMessageArgs) {
  const { email, fromUser, settings, text, toUserName } = props

  const name = props.name !== 'undefined' ? props.name : fromUser
  const preview = `${name} wants to chat to you!`

  return (
    <Layout preview={preview} settings={settings}>
      <p>Hey {toUserName},</p>
      <p>
        <a href={`${settings.siteUrl}/u/${fromUser}`}>{name}</a> has sent you a
        message through{' '}
        <a href={settings.siteUrl} target="_blank">
          {settings.siteName}
        </a>
        .
      </p>
      <p>Please reply directly to their email: {email}.</p>
      ---
      <p>
        <strong>{text}</strong>
      </p>
      ---
    </Layout>
  )
}
