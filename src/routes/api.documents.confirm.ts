import { HTTPException } from 'hono/http-exception';
import type { ContentType } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { sessionContext } from 'src/context';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import {
  getMaxDocumentSize,
  getPendingDocumentPath,
  StorageServiceServer,
} from 'src/services/storageService.server';
import {
  methodNotAllowedError,
  notFoundError,
  payloadTooLargeError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    await validateRequest(request);

    const session = context.get(sessionContext);

    if (!session) {
      throw unauthorizedError();
    }

    const body = await request.json();
    const uploadId = body.uploadId as string;
    const contentType = body.contentType as ContentType;
    const id = body.id ? Number(body.id) : null;
    const fileName = String(body.fileName ?? '').replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!UUID_REGEX.test(uploadId) || !fileName) {
      throw validationError('Invalid upload');
    }

    const storage = new StorageServiceServer(client);
    const pendingPath = getPendingDocumentPath(session.authId, uploadId);
    const size = await storage.getFileSize(pendingPath);

    if (size === null) {
      throw notFoundError('Upload');
    }

    if (size > getMaxDocumentSize(session.roles)) {
      await storage.removeFiles([pendingPath]);
      throw payloadTooLargeError();
    }

    const document = await storage.moveFile(
      pendingPath,
      id ? `${contentType}/${id}` : `users/${session.authId}`,
      fileName,
    );

    return Response.json({ document }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
}
