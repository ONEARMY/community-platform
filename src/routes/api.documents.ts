import { HTTPException } from 'hono/http-exception';
import type { ContentType, IMediaFile } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const contentType = formData.get('contentType') as ContentType;
    const file = formData.get('file') as File;
    const id = formData.has('id') ? Number(formData.get('id') as string) : null;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    await validateRequest(request);

    const uploadResult = await new StorageServiceServer(client).uploadFile(
      [file],
      `${id ? contentType : 'users'}/${id ?? claims.data.claims.sub}`,
    );

    if (uploadResult?.errors && uploadResult?.errors.length > 0) {
      throw validationError(uploadResult?.errors.join(', '));
    }

    const document: IMediaFile = {
      id: uploadResult!.media[0].id,
      name: uploadResult!.media[0].name,
      size: uploadResult!.media[0].size,
    };

    return Response.json({ document }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
}
