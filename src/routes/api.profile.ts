import { HTTPException } from 'hono/http-exception';
import type { DBMedia, ProfileDTO, UserVisitorPreference } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { validationError } from 'src/utils/httpException';

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const nowUtc = new Date().toISOString();

    const { data, error } = await client
      .from('profiles')
      .update({ last_active: nowUtc })
      .eq('auth_id', claims.data.claims.sub)
      .select(
        `*,
        tags:profile_tags_relations(
          profile_tags(
            id,
            name
          )
        ),
        badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url,
            premium_tier
          )
        ),
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url,
          description,
          map_pin_name,
          is_space
        )`,
      )
      .single();

    if (error) {
      throw error;
    }

    const profileFactory = new ProfileFactory(client);
    const profile = profileFactory.fromDB(data);

    return Response.json(profile, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { headers, status: 500 });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const country = formData.get('country');

    const data = {
      displayName: String(formData.get('displayName')),
      about: String(formData.get('about')),
      country: country === 'null' ? null : String(country),
      type: String(formData.get('type')),
      isContactable: formData.get('isContactable') === 'true',
      showVisitorPolicy: formData.get('showVisitorPolicy') === 'true',
      visitorPreferenceDetails: formData.get(
        'visitorPreferenceDetails',
      ) as UserVisitorPreference['details'],
      visitorPreferencePolicy: formData.get(
        'visitorPreferencePolicy',
      ) as UserVisitorPreference['policy'],
      coverImages: formData.has('coverImages')
        ? formData.getAll('coverImages').map((x) => JSON.parse(x as string) as DBMedia)
        : null,
      tagIds: formData.has('tagIds') ? formData.getAll('tagIds').map((x) => Number(x)) : null,
      website: String(formData.get('website')),
      photo: formData.has('photo')
        ? (JSON.parse(formData.get('photo') as string) as DBMedia)
        : null,
    } satisfies ProfileDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profileData = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
    const profileTypes = await new ProfileTypesServiceServer(client).get();

    const memberTypes = profileTypes.filter((x) => x.isSpace === false).map((x) => x.name) || null;

    const { valid, status, statusText } = await validateRequest(
      request,
      data,
      profileData,
      memberTypes,
    );

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    if (!profileData?.id) {
      throw validationError('Profile not found', 'id');
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.updateProfile(profileData?.id, data);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json(profile, { headers, status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    return Response.json({}, { headers, status: 500 });
  }
};

async function validateRequest(
  request: Request,
  data: ProfileDTO,
  profile: { id: number } | null,
  memberTypes: string[] | null,
) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (!profile?.id) {
    throw validationError('Profile not found', 'id');
  }

  if (!data.displayName) {
    throw validationError('displayName is required', 'displayName');
  }

  if (!data.type) {
    throw validationError('type is required', 'type');
  }

  if (!memberTypes || !memberTypes?.includes(data.type)) {
    if (!data.photo && !data.photo) {
      throw validationError('photo is required', 'photo');
    }

    if (!data.coverImages || data.coverImages.length === 0) {
      throw validationError('cover images are required', 'coverImages');
    }

    if (data.showVisitorPolicy && !data.visitorPreferencePolicy) {
      throw validationError('visitor policy is required', 'visitorPreferencePolicy');
    }
  }

  return { valid: true };
}
