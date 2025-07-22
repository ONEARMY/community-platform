import React from 'react'

import { Layout } from './layout.tsx'
import { Button } from './components/button.tsx'
import { Heading } from './components/heading.tsx'
import { Hero } from './components/hero.tsx'
import { PlainText } from './components/plain-text.tsx'

import type { TenantSettings } from 'oa-shared'

const copy = {
  h1: (username: string) => `Hey ${username}!`,
  click: `Confirm email address change`,
  change: (newEmail: string) => `You're changing to use ${newEmail}`,
  intro: "So you've got a fancy new email address?",
  preview: "You've got a new email address!?",
}

interface SignUpEmailProps {
  email_action_type: string
  newEmail: string
  supabaseUrl: string
  redirect_to: string
  settings: TenantSettings
  token_hash: string
  username: string
}

export const EmailChangeNewEmail = (props: SignUpEmailProps) => {
  const {
    username,
    newEmail,
    supabaseUrl,
    email_action_type,
    redirect_to,
    settings,
    token_hash,
  } = props

  const href = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Layout emailType="service" preview={copy.preview} settings={settings}>
      <Heading>{copy.h1(username)}</Heading>
      <Hero>{copy.intro}</Hero>
      <PlainText>{copy.change(newEmail)}</PlainText>

      <Button href={href}>{copy.click}</Button>
    </Layout>
  )
}
