import { UserRole } from 'oa-shared';
import type { LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { sessionContext } from 'src/context';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { AmbassadorServiceServer } from 'src/services/ambassadorService.server';
import { forbiddenError } from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.BETA_TESTER),
];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const profileId = context.get(sessionContext)?.profileId;

  if (!profileId) {
    return forbiddenError().getResponse();
  }

  try {
    const ambassadorCode = await new AmbassadorServiceServer(client).getOrCreateForProfile(
      profileId,
    );

    return Response.json({ code: ambassadorCode.code }, { headers });
  } catch (error) {
    logger.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};
