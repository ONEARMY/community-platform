import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const toText = (value: unknown) =>
  value === undefined ? undefined : (value as string)?.trim() || null;

const toColor = (value: unknown, field: string) => {
  const color = toText(value);

  if (color && !HEX_COLOR.test(color)) {
    throw validationError('Use a hex colour, like #fff0b4', field);
  }

  return color;
};

const toRequiredColor = (value: unknown, field: string) => {
  const color = toColor(value, field);

  if (color === null) {
    throw validationError('Colour is required', field);
  }

  return color;
};

const toUrl = (value: unknown, field: string) => {
  const url = toText(value);

  if (url && !/^https?:\/\//.test(url)) {
    throw validationError('Use a full image URL', field);
  }

  return url;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'PUT') {
      throw methodNotAllowedError();
    }

    const body = await request.json();

    await new TenantSettingsService(client).update({
      colorPrimary: toRequiredColor(body.colorPrimary, 'colorPrimary'),
      colorPrimaryHover: toRequiredColor(body.colorPrimaryHover, 'colorPrimaryHover'),
      colorAccent: toRequiredColor(body.colorAccent, 'colorAccent'),
      colorAccentHover: toRequiredColor(body.colorAccentHover, 'colorAccentHover'),
      colorSecondary: toColor(body.colorSecondary, 'colorSecondary'),
      newsCtaTitle: toText(body.newsCtaTitle),
      newsCtaBody: toText(body.newsCtaBody),
      newsCtaImageUrl: toUrl(body.newsCtaImageUrl, 'newsCtaImageUrl'),
    });

    return Response.json({}, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error saving settings:', error);
    return Response.json({ error: 'Error saving settings' }, { status: 500, headers });
  }
};
