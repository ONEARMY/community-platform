import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { isAllowedImagePickerPath } from 'src/config/imagePickerPaths';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';
import { validateImage } from 'src/utils/storage';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

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
    assertAllowedPath(params.path);

    const images = await new StorageServiceServer(client).listImages(params.path);

    return Response.json({ images }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error listing images:', error);
    return Response.json({ error: 'Error listing images' }, { status: 500, headers });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

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

    logger.error('Error uploading image:', error);
    return Response.json({ error: 'Error uploading image' }, { status: 500, headers });
  }
}
