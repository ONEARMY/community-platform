import { createSupabaseServerClient } from 'src/repository/supabase.server'

import { sendEmail } from '../.server/resend'
import RecieverMessage from '../.server/templates/RecieverMessage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData()

    const data = {
      to: formData.get('to') as string,
      message: formData.get('message') as string,
    }

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const userProfile = await client
      .from('profiles')
      .select('id,username')
      .eq('username', user!.user_metadata.username)
    const recipientProfile = await client
      .from('profiles')
      .select('id,auth_id')
      .eq('username', data.to)

    const from = userProfile.data!.at(0)!.id
    const to = recipientProfile.data!.at(0)!.id

    const today = new Date()
    const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24)
    const countResult = await client
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('sender_id', from)
      .gt('created_at', yesterday.toISOString())

    if (countResult.error) {
      throw countResult.error
    }

    if (countResult.count! >= 20) {
      return Response.json(
        { error: 'You have reached your daily message limit' },
        { status: 429, statusText: 'Too Many Requests' },
      )
    }

    const messageResult = await client.from('messages').insert({
      sender_id: from,
      receiver_id: to,
      message: data.message,
      tenant_id: process.env.TENANT_ID!,
    })

    if (messageResult.error) {
      throw messageResult.error
    }

    const emailResult = await client.rpc('get_user_email_by_id', {
      id: recipientProfile.data![0].auth_id,
    })
    const receiverEmail = emailResult.data[0].email

    // TODO: create notification and send email
    const fromUsername = userProfile.data![0].username
    const settings = await getTenantSettings(client)

    const sendResult = await sendEmail({
      from: settings?.email_from,
      to: receiverEmail,
      subject: `${fromUsername} sent you a message via ${settings?.site_name}!`,
      emailTemplate: (
        <RecieverMessage
          email={receiverEmail}
          fromUser={fromUsername}
          text={data.message}
          toUserName={data.to}
          settings={{
            siteName: settings?.site_name,
            messageSignOff: settings?.message_sign_off,
            siteImage: settings?.site_image,
            siteUrl: settings?.site_url,
          }}
        />
      ),
    })

    if (sendResult.error) {
      throw sendResult.error
    }

    return Response.json(null, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error sending message' },
    )
  }
}

async function getTenantSettings(client: SupabaseClient) {
  return (
    await client
      .from('tenant_settings')
      .select('site_name,site_url,message_sign_off,email_from,site_image')
      .single()
  ).data
}

async function validateRequest(request: Request, user: User | null, data: any) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.to) {
    return { status: 400, statusText: 'to is required' }
  }

  if (!data.message) {
    return { status: 400, statusText: 'message is required' }
  }

  return { valid: true }
}
