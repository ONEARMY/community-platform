import { HTTPException } from 'hono/http-exception';
import type { ContentType, MediaWithPublicUrl } from 'oa-shared';
import { type ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { validationError } from 'src/utils/httpException';
import { validateImage } from 'src/utils/storage';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const contentType = formData.get('contentType') as ContentType;
    const imageFile = formData.get('imageFile') as File;
    const id = formData.has('id') ? Number(formData.get('id') as string) : null;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const { valid, status } = await validateRequest(request, imageFile);

    if (!valid) {
      return Response.json({}, { status, headers });
    }

    const storage = new StorageServiceServer(client);

    const uploadResult = await storage.uploadImage(
      [imageFile],
      `${id ? contentType : 'users'}/${id ?? claims.data.claims.sub}`,
    );

    if (uploadResult?.errors && uploadResult?.errors.length > 0) {
      throw validationError(uploadResult.errors.join(', '));
    }

    const [publicMedia] = storage.getPublicUrls([uploadResult.media[0]]);

    const image: MediaWithPublicUrl = { ...uploadResult.media[0], ...publicMedia };

    return Response.json({ image }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};

async function validateRequest(request: Request, imageFile: File) {
  if (request.method !== 'POST') {
    return { status: 405 };
  }

  const { valid, error } = validateImage(imageFile);

  if (!valid || error) {
    return { status: 400 };
  }

  return { valid: true };
}
