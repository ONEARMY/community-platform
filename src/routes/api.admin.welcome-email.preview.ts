import type { JSONContent } from '@tiptap/core';
import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { sendWelcomeEmail } from 'src/services/welcomeEmailService.server';
import { extractPlainTextFromTiptapJson } from 'src/utils/extractPlainTextFromTiptapJson';
import { methodNotAllowedError, unauthorizedError, validationError } from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const claims = await client.auth.getClaims();
    const email = claims.data?.claims.email;

    if (!email) {
      throw unauthorizedError();
    }

    const body = await request.json();
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const content = body.content as JSONContent | null;

    if (!subject) {
      throw validationError('Subject is required', 'subject');
    }

    if (!extractPlainTextFromTiptapJson(content)) {
      throw validationError('Email body is required', 'content');
    }

    const { data: profile } = await client
      .from('profiles')
      .select('display_name')
      .eq('auth_id', claims.data!.claims.sub)
      .single();

    await sendWelcomeEmail({
      client,
      to: email,
      name: profile?.display_name ?? null,
      siteUrl: new URL(request.url).origin,
      draft: {
        fromName: typeof body.fromName === 'string' ? body.fromName : null,
        subject,
        content,
      },
    });

    return Response.json({}, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error sending welcome email preview:', error);
    return Response.json({ error: 'Error sending test email' }, { status: 500, headers });
  }
};
