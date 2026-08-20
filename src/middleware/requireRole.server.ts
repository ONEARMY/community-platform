import type { UserRole } from 'oa-shared';
import type { MiddlewareFunction } from 'react-router';
import { redirect } from 'react-router';
import { sessionContext } from 'src/context';
import type { ForbiddenPage } from 'src/pages/Forbidden/labels';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { forbiddenError, unauthorizedError } from 'src/utils/httpException';

export const requireRole = (
  role: UserRole,
  forbiddenPage: ForbiddenPage,
): MiddlewareFunction<Response> => {
  return ({ request, context }) => {
    const session = context.get(sessionContext);

    if (!session) {
      throw redirectServiceServer.redirectSignIn(new URL(request.url).pathname, new Headers());
    }

    if (!session.roles.includes(role)) {
      throw redirect(`/forbidden?page=${encodeURIComponent(forbiddenPage)}`);
    }
  };
};

export const requireAnyRole = (
  roles: UserRole[],
  forbiddenPage: ForbiddenPage,
): MiddlewareFunction<Response> => {
  return ({ request, context }) => {
    const session = context.get(sessionContext);

    if (!session) {
      throw redirectServiceServer.redirectSignIn(new URL(request.url).pathname, new Headers());
    }

    if (!roles.some((role) => session.roles.includes(role))) {
      throw redirect(`/forbidden?page=${encodeURIComponent(forbiddenPage)}`);
    }
  };
};

// API routes return a JSON error Response instead of redirecting - a redirect breaks fetch() callers.
export const requireRoleApi = (role: UserRole): MiddlewareFunction<Response> => {
  return ({ context }) => {
    const session = context.get(sessionContext);

    if (!session) {
      throw unauthorizedError().getResponse();
    }

    if (!session.roles.includes(role)) {
      throw forbiddenError().getResponse();
    }
  };
};

export const requireAnyRoleApi = (roles: UserRole[]): MiddlewareFunction<Response> => {
  return ({ context }) => {
    const session = context.get(sessionContext);

    if (!session) {
      throw unauthorizedError().getResponse();
    }

    if (!roles.some((role) => session.roles.includes(role))) {
      throw forbiddenError().getResponse();
    }
  };
};
