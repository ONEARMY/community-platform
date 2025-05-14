import React from 'react'

import { Webhook } from 'standardwebhooks'
import { Resend } from 'resend'
import { render } from '@react-email/components'

import { EmailChangeNewEmail } from './_templates/email-change-new.tsx'
import { MagicLinkEmail } from './_templates/magic-link.tsx'
import { ResetPasswordEmail } from './_templates/reset-password.tsx'
import { SignUpEmail } from './_templates/sign-up.tsx'
import { InstantNotificationEmail } from './_templates/instant-notification-email.tsx'
import { signWebhookHeader } from './signWebhookHeader.ts'
import { getTenantSettings } from './getTenantSettings.ts'

import type { Notification, TenantSettings } from 'oa-shared'

const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string
const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''

type User = {
  email: string
  new_email?: string
  user_metadata: {
    username: string
  }
}

type EmailData = {
  email_action_type: string
  notification?: Notification
  redirect_to?: string
  token?: string
  token_hash?: string
  token_new?: string
  token_hash_new?: string
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const webhook = new Webhook(hookSecret)
  const headers = signWebhookHeader(webhook, req.headers, payload)

  try {
    const { email_data, user } = webhook.verify(payload, headers) as {
      email_data: EmailData
      user: User
    }

    const settings = await getTenantSettings(req, email_data.redirect_to)

    let html: string = ''
    let subject: string = ''
    let to = user.email

    const details = {
      supabaseUrl,
      settings,
      ...email_data,
    } as any

    switch (email_data.email_action_type) {
      case 'instant_notification': {
        subject = `A new ${email_data.notification?.contentType} on ${email_data.notification?.sourceContent?.title}`
        html = await render(
          React.createElement(InstantNotificationEmail, details),
        )
        break
      }
      case 'signup': {
        subject = 'Welcome! Please confirm your email'
        details.username = user['user_metadata'].username

        html = await render(React.createElement(SignUpEmail, details))
        break
      }
      case 'login': {
        subject = 'Fancy magic link for login!'
        details.username = user['user_metadata'].username

        html = await render(React.createElement(MagicLinkEmail, details))
        break
      }
      case 'recovery': {
        subject = 'So you need to reset your password?'
        details.username = user['user_metadata'].username

        html = await render(React.createElement(ResetPasswordEmail, details))
        break
      }
      case 'email_change': {
        const newEmail = user['new_email']!
        subject = "You're changing your email"
        to = newEmail
        details.username = user['user_metadata'].username

        html = await render(
          React.createElement(EmailChangeNewEmail, {
            ...details,
            newEmail,
          }),
        )
        break
      }
      default: {
        throw new Error(
          `Template not implemented for: ${email_data.email_action_type}`,
        )
      }
    }

    await resend.emails.send({
      from: `${settings.messageSignOff} <${settings.emailFrom}>`,
      to,
      subject,
      html,
    })
  } catch (error: any) {
    console.log(error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'application/json')

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  })
})
