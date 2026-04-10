import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs } from 'react-router';
import { MESSAGE_MAX_CHARACTERS, MESSAGE_MIN_CHARACTERS } from 'src/pages/User/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import {
  methodNotAllowedError,
  tooManyRequestsError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';
import { sendEmail } from '../.server/resend';
import ReceiverMessage from '../.server/templates/ReceiverMessage';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();

    const data = {
      to: formData.get('to') as string,
      message: formData.get('message') as string,
      name: formData.has('name') ? (formData.get('name') as string) : undefined,
    };

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    await validateRequest(request, claims.data.claims.email!, data);

    const userProfile = await client
      .from('profiles')
      .select('id,username,display_name')
      .eq('auth_id', claims.data.claims.sub);

    const messenger = userProfile.data?.at(0);
    if (!messenger?.username) {
      return Response.json(
        { error: 'You must set a username before sending messages' },
        { headers, status: 403 },
      );
    }

    const recipientProfile = await client
      .from('profiles')
      .select('id,auth_id')
      .eq('username', data.to);

    const from = messenger.id;
    const to = recipientProfile.data!.at(0)!.id;
    const toAuthId = recipientProfile.data!.at(0)!.auth_id;

    const today = new Date();
    const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
    const countResult = await client
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('sender_id', from)
      .gt('created_at', yesterday.toISOString());

    if (countResult.error) {
      throw countResult.error;
    }

    if (countResult.count! >= 20) {
      throw tooManyRequestsError(
        "You've contacted a lot of people today! So to protect the platform from spam we haven't sent this message.",
      );
    }

    const settings = await new TenantSettingsService(client).get();

    const messageResult = await client.from('messages').insert({
      sender_id: from,
      receiver_id: to,
      message: data.message,
      tenant_id: process.env.TENANT_ID!,
    });

    if (messageResult.error) {
      throw messageResult.error;
    }

    // TODO: use get_user_email_by_id only after removing firebase completely and all profiles have an auth_id
    const emailResult = toAuthId
      ? await client.rpc('get_user_email_by_id', { id: toAuthId })
      : await client.rpc('get_user_email_by_username', {
          username: data.to,
        });
    const receiver = emailResult.data[0];

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
    );

    const sendResult = await sendEmail({
      from: settings.emailFrom,
      to: receiver.email,
      subject: `${messenger.username} sent you a message via ${settings.siteName}!`,
      emailTemplate,
    });

    if (sendResult.error) {
      throw sendResult.error;
    }

    return Response.json(null, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);

    return Response.json({ error }, { headers, status: 500, statusText: 'Error sending message' });
  }
};

async function validateRequest(request: Request, userEmail: string | null, data: any) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.to) {
    throw validationError('to is required', 'to');
  }

  if (!data.message) {
    throw validationError('message is required', 'message');
  }

  if (data.message.length < MESSAGE_MIN_CHARACTERS) {
    throw validationError(
      `Message must be at least ${MESSAGE_MIN_CHARACTERS} characters`,
      'message',
    );
  }

  if (data.message.length > MESSAGE_MAX_CHARACTERS) {
    throw validationError(
      `Message must be no more than ${MESSAGE_MAX_CHARACTERS} characters`,
      'message',
    );
  }

  if (!userEmail) {
    throw validationError('Unable to get messenger email address', 'email');
  }
}
