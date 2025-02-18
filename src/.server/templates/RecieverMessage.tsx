import React from 'react'
import Layout from './Layout'
import { MessageSettings } from '../models/messageSettings'

type RecieverMessageArgs = {
  settings: MessageSettings
  text: string
  toUserName: string
  fromUser: string
  email: string
}
// TODO: base settings object to pass to layout
export default function RecieverMessage({
  settings,
  text,
  toUserName,
  fromUser,
  email,
}: RecieverMessageArgs) {
  return (
    <Layout settings={settings}>
      <p>Hey {toUserName}</p>
      <p>
        {fromUser} has sent you a message through{' '}
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
