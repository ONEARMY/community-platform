import React from 'react'

import { Layout } from './layout.tsx'
import { Button } from './components/button.tsx'
import { Heading } from './components/heading.tsx'
import { Hero } from './components/hero.tsx'
import { PlainText } from './components/plain-text.tsx'

import type { TenantSettings } from 'oa-shared'

const copy = {
  h1: (username: string) => `Hey ${username}! We're excited you're joining us`,
  emailConfirmationBody:
    'Please complete the email confirmation for full access.',
  clickHere: 'Confirm your email address',
  notRequested:
    'If you did not request this email, there is nothing to worry about, you can safely ignore this.',
  preview: 'Welcome! We need you to confirm your email address',
}

interface SignUpEmailProps {
  username: string
  supabaseUrl: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  settings: TenantSettings
}

export const SignUpEmail = (props: SignUpEmailProps) => {
  const {
    username,
    supabaseUrl,
    email_action_type,
    redirect_to,
    settings,
    token_hash,
  } = props

  const href = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`
  const preferencesUpdatePath = `${settings.siteUrl}/settings/notifications`

  return (
    <Layout
      preferencesUpdatePath={preferencesUpdatePath}
      preview={copy.preview}
      settings={settings}
    >
      <Heading>{copy.h1(username)}</Heading>
      <Hero>{copy.emailConfirmationBody}</Hero>

      <Button href={href}>{copy.clickHere}</Button>

      <PlainText>{copy.notRequested}</PlainText>
    </Layout>
  )
}
