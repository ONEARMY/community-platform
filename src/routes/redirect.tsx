import { type NotificationContentType, NotificationContentTypes } from 'oa-shared';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentRedirectServiceServer } from 'src/services/contentRedirectService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { client } = createSupabaseServerClient(request);

    const requestUrl = new URL(request.url);
    const id = Number(requestUrl.searchParams.get('id'));
    const contentType = requestUrl.searchParams.get('ct') as NotificationContentType;

    if (!NotificationContentTypes.includes(contentType)) {
      throw new Error('Invalid ct param');
    }

    if (!id) {
      throw new Error('Invalid id param');
    }

    const url = await new ContentRedirectServiceServer(client).getUrl(id, contentType);

    if (!url) {
      throw new Error(`Url could not be resolved for - id: ${id}, ct: ${contentType}`);
    }

    return redirect(url);
  } catch (error) {
    console.error(error);
  }

  return redirect('/');
}
