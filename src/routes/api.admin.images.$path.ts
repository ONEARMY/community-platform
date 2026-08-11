import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { isAllowedImagePickerPath } from 'src/config/imagePickerPaths';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';
import { validateImage } from 'src/utils/storage';

async function requireAdmin(client: ReturnType<typeof createSupabaseServerClient>['client']) {
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    throw unauthorizedError();
  }

  const { data: profiles } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', claims.data.claims.sub)
    .limit(1);

  if (!profiles?.at(0)?.roles?.includes(UserRole.ADMIN)) {
    throw forbiddenError();
  }
}

function assertAllowedPath(path: string | undefined): asserts path is string {
  if (!path || !isAllowedImagePickerPath(path)) {
    throw validationError('This folder is not available for the image picker', 'path');
  }
}

function sanitizeFileName(name: string) {
  const base = name.split(/[/\\]/).pop() || 'image';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    await requireAdmin(client);
    assertAllowedPath(params.path);

    const images = await new StorageServiceServer(client).listImages(params.path);

    return Response.json({ images }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error('Error listing images:', error);
    return Response.json({ error: 'Error listing images' }, { status: 500, headers });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    await requireAdmin(client);
    assertAllowedPath(params.path);

    const formData = await request.formData();
    const imageFile = formData.get('imageFile') as File | null;

    if (!imageFile) {
      throw validationError('An image file is required', 'imageFile');
    }

    const { error: validationErr } = validateImage(imageFile);

    if (validationErr) {
      throw validationError(validationErr.message);
    }

    const safeFile = new File([imageFile], sanitizeFileName(imageFile.name), {
      type: imageFile.type,
    });

    const storage = new StorageServiceServer(client);
    const uploadResult = await storage.uploadImage([safeFile], params.path);

    if (uploadResult.errors.length > 0) {
      throw validationError(uploadResult.errors.join(', '));
    }

    const [image] = storage.getPublicUrls(uploadResult.media);

    return Response.json({ image }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error('Error uploading image:', error);
    return Response.json({ error: 'Error uploading image' }, { status: 500, headers });
  }
}
