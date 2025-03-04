import Layout from './Layout'
import { MessageSettings } from '../models/messageSettings'

type RecieverMessageArgs = {
  email: string
  fromUser: string
  preview: string
  settings: MessageSettings
  text: string
  toUserName: string
  name: string | undefined
}

export default function RecieverMessage(props: RecieverMessageArgs) {
  const { email, fromUser, preview, settings, text, name, toUserName } = props

  return (
    <Layout preview={preview} settings={settings}>
      <p>Hey {toUserName},</p>
      <p>
        <a href={`${settings.siteUrl}/u/${fromUser}`}>{name || fromUser}</a> has
        sent you a message through{' '}
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
