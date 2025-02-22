import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

import { Layout } from './layout.tsx'

const copy = {
  h1: (username: string) => `Hey ${username}!`,
  click: `Confirm email address change`,
  change: (newEmail: string) => `You're changing to use ${newEmail}`,
  intro: "So you've got a fancy new email address?",
  preview: "You've got a new email address!?",
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
      <Heading style={h1}>{copy.h1(username)}</Heading>
      <Text style={heroText}>{copy.intro}</Text>
      <Text style={text}>{copy.change(newEmail)}</Text>

      <Button style={button} href={href} target="_blank">
        {copy.click}
      </Button>
    </Layout>
  )
}
