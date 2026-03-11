import type { ContentType } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { storageServiceServer } from 'src/services/storageService.server';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const contentType = formData.get('contentType') as ContentType;
    const document = formData.get('file') as File;
    const id = formData.has('id') ? Number(formData.get('id') as string) : null;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const { valid, status, statusText } = await validateRequest(request);

    if (!valid) {
      return Response.json({}, { status, statusText, headers });
    }

    const uploadedFile = await storageServiceServer.uploadFile(
      [document],
      `${id ? contentType : 'users'}/${id ?? claims.data.claims.sub}`,
      client,
    );

    if (uploadedFile?.errors && uploadedFile?.errors.length > 0) {
      throw uploadedFile?.errors;
    }

    return Response.json({ document: { ...uploadedFile!.media[0] } }, { headers });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error uploading document' });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    return { valid: false, status: 405, statusText: 'Method not allowed' };
  }

  return { valid: true };
}
