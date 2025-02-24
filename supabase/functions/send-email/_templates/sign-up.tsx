import React from 'npm:react@18.3.1'

import { Layout } from './layout.tsx'
import { Button } from './components/button.tsx'
import { Heading } from './components/heading.tsx'
import { Hero } from './components/hero.tsx'
import { PlainText } from './components/plain-text.tsx'

const copy = {
  h1: (username: string) =>
    `Hey ${username}! Thanks for joining the community Platform`,
  emailConfirmationBody:
    'Please complete the email confirmation for full access.',
  clickHere: 'Confirm your email address',
  notRequested:
    'If you did not request this email, there is nothing to worry about, you can safely ignore this.',
  preview: 'Welcome! We need you to confirm your email address',
}

interface SignUpEmailProps {
  username: string
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}

export const SignUpEmail = (props: SignUpEmailProps) => {
  const { username, supabase_url, email_action_type, redirect_to, token_hash } =
    props

  const href = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Layout preview={copy.preview}>
      <Heading>{copy.h1(username)}</Heading>
      <Hero>{copy.emailConfirmationBody}</Hero>

      <Button href={href}>{copy.clickHere}</Button>

      <PlainText>{copy.notRequested}</PlainText>
    </Layout>
  )
}
