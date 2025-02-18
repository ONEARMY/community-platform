import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

import { Layout } from './layout.tsx'

const copy = {
  h1: (username: string) => `Hey ${username}!`,
  intro:
    "So you forgot your password? That's ok, it can happen to the best of us.",
  clickHere: 'Reset... Now!',
  notRequested:
    'If you did not request this email, there is nothing to worry about, you can safely ignore this.',
  preview: 'I need to reset your password?',
}

const h1 = {
  fontSize: '18px',
  fontWeight: '700',
  marginBottom: '12px',
  padding: '0',
}

const heroText = {
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '6px',
}

const text = {
  color: '#000',
  fontSize: '14px',
}

const button = {
  backgroundColor: '#fee77b',
  borderRadius: '15px',
  border: '2px solid #000',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '19px 30px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
}

interface SignUpEmailProps {
  username: string
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}

export const ResetPasswordEmail = (props: SignUpEmailProps) => {
  const { username, supabase_url, email_action_type, redirect_to, token_hash } =
    props

  const href = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Layout preview={copy.preview}>
      <Heading style={h1}>{copy.h1(username)}</Heading>
      <Text style={heroText}>{copy.intro}</Text>

      <Button style={button} href={href} target="_blank">
        {copy.clickHere}
      </Button>

      <Text style={text}>{copy.notRequested}</Text>
    </Layout>
  )
}
