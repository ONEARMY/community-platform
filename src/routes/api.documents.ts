import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { sessionContext } from 'src/context';
import { logger } from 'src/logger';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import {
  getMaxDocumentSize,
  getPendingDocumentPath,
  StorageServiceServer,
} from 'src/services/storageService.server';
import {
  methodNotAllowedError,
  payloadTooLargeError,
  unauthorizedError,
} from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    await validateRequest(request);

    const session = context.get(sessionContext);

    if (!session) {
      throw unauthorizedError();
    }

    const { size } = await request.json();

    if (!(Number(size) <= getMaxDocumentSize(session.roles))) {
      throw payloadTooLargeError();
    }

    const uploadId = crypto.randomUUID();
    const uploadUrl = await new StorageServiceServer(client).createFileUpload(
      getPendingDocumentPath(session.authId, uploadId),
    );

    return Response.json({ uploadId, uploadUrl }, { headers });
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
