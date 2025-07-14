import React from 'react'

import { Layout } from './layout.tsx'
import { Button } from './components/button.tsx'
import { Heading } from './components/heading.tsx'
import { Hero } from './components/hero.tsx'
import { PlainText } from './components/plain-text.tsx'

import type { TenantSettings } from 'oa-shared'

const copy = {
  h1: (username: string) => `Hey ${username}! Time to login`,
  intro: 'You requested a magic link for fast login',
  clickHere: 'Login... with magic!',
  notRequested:
    'If you did not request this email, there is nothing to worry about, you can safely ignore this.',
  preview: "Here's your magic link!",
}

interface SignUpEmailProps {
  username: string
  supabaseUrl: string
  newEmail: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  settings: TenantSettings
}

export const MagicLinkEmail = (props: SignUpEmailProps) => {
  const {
    username,
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

      <Button href={href}>{copy.clickHere}</Button>

      <PlainText>{copy.notRequested}</PlainText>
    </Layout>
  )
}
