import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Create a structured HTTP exception with error details
 * Similar to RFC 7807 Problem Details but using Hono's HTTPException
 */
function createHTTPException(
  status: ContentfulStatusCode,
  message: string,
  details?: Record<string, any>,
) {
  return new HTTPException(status, {
    message,
    res: Response.json(
      {
        error: message,
        status,
        ...details,
      },
      { status },
    ),
  });
}

export function validationError(message: string, field?: string) {
  return createHTTPException(400, message, { field });
}

export function methodNotAllowedError() {
  return createHTTPException(405, 'Method not allowed');
}

export function notFoundError(resource: string) {
  return createHTTPException(404, `${resource} not found`);
}

export function forbiddenError(message = 'Forbidden') {
  return createHTTPException(403, message);
}

export function conflictError(message: string) {
  return createHTTPException(409, message);
}
