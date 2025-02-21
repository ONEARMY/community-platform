import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'

import { EmailChangeNewEmail } from './_templates/email-change-new.tsx'
import { EmailChangeOldEmail } from './_templates/email-change-old.tsx'
import { MagicLinkEmail } from './_templates/magic-link.tsx'
import { ResetPasswordEmail } from './_templates/reset-password.tsx'
import { SignUpEmail } from './_templates/sign-up.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

type User = {
  email: string
  new_email?: string
  user_metadata: {
    username: string
  }
}

type EmailData = {
  token: string
  token_hash: string
  redirect_to: string
  email_action_type: string
  site_url: string
  token_new: string
  token_hash_new: string
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)

  try {
    const {
      user,
      email_data: {
        token_hash,
        token_hash_new,
        redirect_to,
        email_action_type,
      },
    } = wh.verify(payload, headers) as {
      user: User
      email_data: EmailData
    }

    let html: string = ''
    let subject: string = ''

    const details = {
      username: user['user_metadata'].username,
      supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
      token_hash,
      redirect_to,
      email_action_type,
    }

    switch (email_action_type) {
      case 'signup': {
        subject = 'Welcome! Please confirm your email'
        html = await renderAsync(React.createElement(SignUpEmail, details))
        break
      }
      case 'login': {
        subject = 'Fancy magic link for login!'
        html = await renderAsync(React.createElement(MagicLinkEmail, details))
        break
      }
      case 'recovery': {
        subject = 'So you need to reset your password?'
        html = await renderAsync(
          React.createElement(ResetPasswordEmail, details),
        )
        break
      }
      case 'email_change': {
        const newEmail = user['new_email']!
        subject = "You're changing your email"
        html = await renderAsync(
          React.createElement(EmailChangeOldEmail, { ...details, newEmail }),
        )

        const newEmailDetails = {
          ...details,
          newEmail,
          token_hash: token_hash_new,
        }
        const newHtml = await renderAsync(
          React.createElement(EmailChangeNewEmail, newEmailDetails),
        )
        resend.emails.send({
          from: 'Community Platform <community@onearmy.earth>',
          to: [newEmail],
          subject,
          html: newHtml,
        })
        break
      }
      default: {
        throw new Error(`Template not implemented for: ${email_action_type}`)
      }
    }

    resend.emails.send({
      from: 'Community Platform <community@onearmy.earth>',
      to: [user.email],
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
