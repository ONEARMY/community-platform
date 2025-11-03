import { createSupabaseServerClient } from 'src/repository/supabase.server'

import { sendEmail } from '../.server/resend'
import ReceiverMessage from '../.server/templates/ReceiverMessage'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TenantSettings } from 'oa-shared'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()

    const data = {
      to: formData.get('to') as string,
      message: formData.get('message') as string,
      name: formData.has('name') ? (formData.get('name') as string) : undefined,
    }

    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      claims.data.claims.email,
      data,
    )

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const userProfile = await client
      .from('profiles')
      .select('id,username')
      .eq('username', claims.data.claims.user_metadata.username)

    const recipientProfile = await client
      .from('profiles')
      .select('id,auth_id')
      .eq('username', data.to)

    const from = userProfile.data!.at(0)!.id
    const to = recipientProfile.data!.at(0)!.id
    const toAuthId = recipientProfile.data!.at(0)!.auth_id

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
          headers,
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

    // TODO: use get_user_email_by_id only after removing firebase completely and all profiles have an auth_id
    const emailResult = toAuthId
      ? await client.rpc('get_user_email_by_id', { id: toAuthId })
      : await client.rpc('get_user_email_by_username', {
          username: data.to,
        })
    const receiver = emailResult.data[0]
    const messenger = userProfile.data![0]

    const emailTemplate = (
      <ReceiverMessage
        settings={{
          siteName: settings.siteName,
          messageSignOff: settings.messageSignOff,
          siteImage: settings.siteImage,
          siteUrl: settings.siteUrl,
        }}
        text={data.message}
        receiverName={data.to}
        messengerEmailAddress={claims.data.claims.email as string}
        messengerName={data.name}
        messengerUsername={messenger.username}
      />
    )

    const sendResult = await sendEmail({
      from: settings.emailFrom,
      to: receiver.email,
      subject: `${messenger.username} sent you a message via ${settings.siteName}!`,
      emailTemplate,
    })

    if (sendResult.error) {
      return Response.json(
        { error: sendResult.error },
        { headers, status: 429, statusText: sendResult.error },
      )
    }

    return Response.json(null, { headers, status: 201 })
  } catch (error) {
    console.error(error)

    return Response.json(
      { error },
      { headers, status: 500, statusText: 'Error sending message' },
    )
  }
}

export async function getTenantSettings(
  client: SupabaseClient,
): Promise<TenantSettings> {
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

async function validateRequest(
  request: Request,
  userEmail: string | null,
  data: any,
) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.to) {
    return { status: 400, statusText: 'to is required' }
  }

  if (!data.message) {
    return { status: 400, statusText: 'message is required' }
  }

  if (!userEmail) {
    return { status: 400, statusText: 'Unable to get messenger email address' }
  }

  return { valid: true }
}
