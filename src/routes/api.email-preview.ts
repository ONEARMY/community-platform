import { HTTPException } from 'hono/http-exception';
import { DBMedia, News, Notification, NotificationDisplay } from 'oa-shared';
import { data, type LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { NotificationEmailServiceServer } from 'src/services/notificationEmailService.server';
import { TagsServiceServer } from 'src/services/tagsService.server';
import { methodNotAllowedError, unauthorizedError } from 'src/utils/httpException';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const heroImage = formData.has('heroImage')
    ? await new NewsServiceServer(client).getHeroImage(
        JSON.parse(formData.get('heroImage') as string) as DBMedia,
      )
    : null;

  const tagIds = formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : [];
  const tags = tagIds.length > 0 ? await new TagsServiceServer(client).getTags(tagIds) : [];

  const draftNews = {
    actionType: 'newNews',
    contentType: 'news',
    sourceContentType: 'news',
    title: formData.has('title') ? (formData.get('title') as string) : '[No title]',
    contentId: formData.has('id') ? Number(formData.get('id')) : undefined,
    content: new News({
      id: formData.has('id') ? Number(formData.get('id')) : undefined,
      title: formData.has('title') ? (formData.get('title') as string) : '[No title]',
      body: formData.has('body') ? (formData.get('body') as string) : '[No body]',
      createdAt: new Date(),
      heroImage,
      tags,
    }),
  } as Notification;

  const draftNotificationDisplay = NotificationDisplay.fromNotification(draftNews);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const userProfile = await client
      .from('profiles')
      .select('id,created_at')
      .eq('auth_id', claims.data.claims.sub);

    if (userProfile.data && userProfile.data[0]) {
      await new NotificationEmailServiceServer(client).sendNewsPreview(
        {
          email: claims.data.claims.email!,
          profileId: userProfile.data[0].id,
          createdAt: userProfile.data[0].created_at,
        },
        draftNotificationDisplay,
        new URL(request.url).origin,
      );
    }

    return data({}, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);

    return Response.json({}, { headers, status: 500 });
  }
};
