import { HTTPException } from 'hono/http-exception';
import type { DBMapPin, DBProfile, UpsertPin } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { MapPinFactory } from 'src/factories/mapPinFactory.server';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { MapPinsServiceServer } from 'src/services/mapPinsService.server';
import { MapServiceServer } from 'src/services/mapService.server';
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
    const dbProfile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!dbProfile) {
      throw forbiddenError();
    }

    if (request.method === 'DELETE') {
      return await deletePin(request, dbProfile);
    }

    const profile = new ProfileFactory(client).fromDB(dbProfile);

    const formData = await request.formData();
    const data: UpsertPin = {
      name: formData.get('name') as string,
      country: formData.get('country') as string,
      country_code: formData.get('countryCode') as string,
      administrative: formData.get('administrative') as string,
      post_code: formData.get('postCode') as string,
      lat: Number(formData.get('lat')),
      lng: Number(formData.get('lng')),
      profile_id: profile.id,
    };

    await validateRequest(request, data);

    const mapService = new MapServiceServer(client);
    const result = await mapService.upsert(data, profile);

    if (result?.error) {
      console.error(result.error);
      throw new Error(result.error.message || 'Error saving map pin');
    }

    const pinFactory = new MapPinFactory(client);
    const mapPin = pinFactory.fromDBWithProfile(result.data as unknown as DBMapPin);

    profileService.updateUserActivity(claims.data.claims.sub);

    return Response.json({ mapPin }, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error saving map pin' });
  }
};

async function validateRequest(request: Request, data: UpsertPin) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
  if (!data.country) {
    throw validationError('country is required');
  }
  if (!data.country_code) {
    throw validationError('countryCode is required');
  }
  if (!data.lat) {
    throw validationError('lat is required');
  }
  if (!data.lng) {
    throw validationError('lng is required');
  }
}

async function deletePin(request: Request, profile: DBProfile) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    await new MapPinsServiceServer(client).delete(profile.id);
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }

  return Response.json({}, { headers, status: 200 });
}
