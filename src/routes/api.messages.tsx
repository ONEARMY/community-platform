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
      name: (formData.get('name') as string) || undefined,
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
        { error: 'Too many requests' },
        {
          status: 429,
          statusText:
            "You've contacted a lot of people today! So to protect the platform from spam we haven't sent this message.",
        },
      )
    }

    const settings = await getTenantSettings(client)

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
    const fromUsername = userProfile.data![0].username
    const emailTemplate = (
      <RecieverMessage
        email={receiverEmail}
        fromUser={fromUsername}
        name={data.name}
        preview={`${fromUsername} wants to chat to you!`}
        text={data.message}
        toUserName={data.to}
        settings={{
          siteName: settings.siteName,
          messageSignOff: settings.messageSignOff,
          siteImage: settings.siteImage,
          siteUrl: settings.siteUrl,
        }}
      />
    )

    const sendResult = await sendEmail({
      from: settings.emailFrom,
      to: receiverEmail,
      subject: `${fromUsername} sent you a message via ${settings.siteName}!`,
      emailTemplate,
    })

    if (sendResult.error) {
      return Response.json(
        { error: sendResult.error },
        { status: 429, statusText: sendResult.error },
      )
    }

    return Response.json(null, { headers, status: 201 })
  } catch (error) {
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error sending message' },
    )
  }
}

async function getTenantSettings(client: SupabaseClient) {
  const { data } = await client
    .from('tenant_settings')
    .select('site_name,site_url,message_sign_off,email_from,site_image')
    .single()

  return {
    siteName: data?.site_name || 'The Community Platform',
    siteUrl: data?.site_url || 'https://community.preciousplastic.com',
    messageSignOff: data?.message_sign_off || 'One Army',
    emailFrom: data?.email_from || 'hello@onearmy.earth',
    siteImage:
      data?.site_image ||
      'https://community.preciousplastic.com/assets/img/one-army-logo.png',
  }
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
