import { DBMedia, News, Notification, NotificationDisplay } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { NotificationEmailServiceServer } from 'src/services/notificationEmailService.server';
import { methodNotAllowedError } from 'src/utils/httpException';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const heroImage = formData.has('heroImage')
    ? await new NewsServiceServer(client).getHeroImage(
        JSON.parse(formData.get('heroImage') as string) as DBMedia,
      )
    : null;

  const draftNews = {
    actionType: 'newNews',
    contentType: 'news',
    sourceContentType: 'news',

    title: formData.has('title') ? (formData.get('title') as string) : '[No title]',
    content: {
      title: formData.has('title') ? (formData.get('title') as string) : '[No title]',
      body: formData.has('body') ? (formData.get('body') as string) : '[No body]',
      createdAt: new Date(),
      heroImage,
    } as News,
  } as Notification;

  const draftNotificationDisplay = NotificationDisplay.fromNotification(draftNews);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    await validateRequest(request);

    const userProfile = await client
      .from('profiles')
      .select('id,created_at')
      .eq('auth_id', claims.data.claims.sub);

    if (userProfile.data && userProfile.data![0]) {
      const previewer = {
        email: claims.data.claims.email,
        profile_id: userProfile.data![0].id,
        createdAt: userProfile.data![0].created_at,
      };

      await new NotificationEmailServiceServer(client).sendNewsPreview(
        previewer,
        draftNotificationDisplay,
      );
    }

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      {},
      {
        headers,
        status: 500,
        statusText: 'Error sending preview email. Please contact an admin',
      },
    );
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
}
