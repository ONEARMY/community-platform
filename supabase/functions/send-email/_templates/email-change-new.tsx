import React from 'npm:react@18.3.1'

import { Layout } from './layout.tsx'
import { Button } from './components/button.tsx'
import { Heading } from './components/heading.tsx'
import { Hero } from './components/hero.tsx'
import { PlainText } from './components/plain-text.tsx'

const copy = {
  h1: (username: string) => `Hey ${username}!`,
  click: `Confirm email address change`,
  change: (newEmail: string) => `You're changing to use ${newEmail}`,
  intro: "So you've got a fancy new email address?",
  preview: "You've got a new email address!?",
}

interface SignUpEmailProps {
  username: string
  newEmail: string
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}

export const EmailChangeNewEmail = (props: SignUpEmailProps) => {
  const {
    username,
    newEmail,
    supabase_url,
    email_action_type,
    redirect_to,
    token_hash,
  } = props

  const href = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Layout preview={copy.preview}>
      <Heading>{copy.h1(username)}</Heading>
      <Hero>{copy.intro}</Hero>
      <PlainText>{copy.change(newEmail)}</PlainText>

      <Button href={href}>{copy.click}</Button>
    </Layout>
  )
}
