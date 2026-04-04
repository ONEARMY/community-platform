import { HTTPException } from 'hono/http-exception';
import type { IImpactDataField, IUserImpact } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ImpactServiceServer } from 'src/services/impactService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw forbiddenError();
    }

    const formData = await request.formData();
    const fieldData = {
      year: Number(formData.get('year')),
      fields: formData.get('fields') as string,
    };

    await validateRequest(request, fieldData);

    const fields: IImpactDataField[] = JSON.parse(fieldData.fields);
    const impactService = new ImpactServiceServer(client);
    const result = await impactService.update(profile.id, fieldData.year, fields);

    if (result?.error) {
      console.error(result.error);
      throw new Error(result.error.message || 'Error saving impact');
    }

    const impact = result.data as unknown as IUserImpact;

    profileService.updateUserActivity(claims.data.claims.sub);

    return data(impact, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error saving impact' });
  }
};

async function validateRequest(request: Request, data: any) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
  if (!data.year) {
    throw validationError('year is required');
  }

  if (!data.fields) {
    throw validationError('fields are required');
  }

  try {
    const fields: IImpactDataField[] = JSON.parse(data.fields);

    if (!Array.isArray(fields) || !fields?.length) {
      throw validationError('fields are not valid');
    }
  } catch (_) {
    throw validationError('fields are not valid');
  }
}
