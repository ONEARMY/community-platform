import type { ContentType, IMediaFile } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StorageServiceServer } from 'src/services/storageService.server';

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

    const { valid, status, statusText } = await validateRequest(request);

    if (!valid) {
      return Response.json({}, { status, statusText, headers });
    }

    const uploadedFile = await new StorageServiceServer(client).uploadFile(
      [file],
      `${id ? contentType : 'users'}/${id ?? claims.data.claims.sub}`,
    );

    if (!uploadedFile || (uploadedFile?.errors && uploadedFile?.errors.length > 0)) {
      throw uploadedFile?.errors;
    }

    const document: IMediaFile = {
      id: uploadedFile!.media[0].id,
      name: uploadedFile!.media[0].name,
      size: uploadedFile!.media[0].size,
    };

    return Response.json({ document }, { headers });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    return { valid: false, status: 405, statusText: 'Method not allowed' };
  }

  return { valid: true };
}
