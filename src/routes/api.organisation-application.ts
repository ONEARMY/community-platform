import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBProfile, ProfileType } from 'oa-shared';
import { type ActionFunctionArgs, data } from 'react-router';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import {
  MAX_ORGANISATION_COVER_IMAGES,
  ORGANISATION_DESCRIPTION_MAX_LENGTH,
} from 'src/pages/SignUp/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { sendModerationEmail } from 'src/services/moderationEmailService.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { forbiddenError, validationError } from 'src/utils/httpException';

type OrganisationApplicationData = {
  type: string;
  username: string;
  displayName: string;
  about: string;
  website: string | null;
  coverImages: DBMedia[] | null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      return Response.json({}, { headers, status: 405, statusText: 'method not allowed' });
    }

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const authId = claims.data.claims.sub;

    const formData = await request.formData();
    const website = formData.get('website');

    const submissionData: OrganisationApplicationData = {
      type: String(formData.get('type')),
      username: String(formData.get('username') ?? '').trim(),
      displayName: String(formData.get('displayName') ?? '').trim(),
      about: String(formData.get('about') ?? '').trim(),
      website: website ? String(website) : null,
      coverImages: formData.has('coverImages')
        ? formData.getAll('coverImages').map((x) => JSON.parse(x as string) as DBMedia)
        : null,
    };

    const applicationsService = new OrganisationApplicationsServiceServer(client);
    const hasApplication = await applicationsService.existsByAuthId(authId);

    if (!hasApplication) {
      throw forbiddenError('This account is not an organisation applicant');
    }

    const profileService = new ProfileServiceServer(client);
    const existingProfile = await profileService.getByAuthId(authId);

    if (existingProfile) {
      throw forbiddenError('This account already has a profile');
    }

    const profileTypes = await new ProfileTypesServiceServer(client).get();
    const selectedType = await validateRequest(client, submissionData, profileTypes);

    const { data: created, error } = await profileService.createOrganisationProfile({
      authId,
      username: submissionData.username,
      displayName: submissionData.displayName,
      about: submissionData.about,
      website: submissionData.website,
      coverImages: submissionData.coverImages,
      profileTypeId: selectedType.id,
    });

    if (error) {
      // Unique index backstop: the username was claimed between the availability check and this insert
      if (error.code === '23505') {
        throw validationError('Username is already taken', 'username');
      }

      throw error;
    }

    await applicationsService.deleteByAuthId(authId);

    await sendModerationEmail({
      authId,
      client,
      feedback: null,
      moderation: 'awaiting-moderation',
      requestOrigin: new URL(request.url).origin,
      username: submissionData.username,
    });

    profileService.updateUserActivity(authId);

    const profile = new ProfileFactory(client).fromDB(created as DBProfile);

    return data(profile, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};

export async function validateRequest(
  client: ReturnType<typeof createSupabaseServerClient>['client'],
  data: OrganisationApplicationData,
  profileTypes: ProfileType[],
): Promise<ProfileType> {
  const selectedType = profileTypes.find((x) => x.name === data.type && x.isSpace);

  if (!selectedType) {
    throw validationError('A valid organisation type is required', 'type');
  }

  if (!data.username) {
    throw validationError('Username is required', 'username');
  }

  if (/[^a-zA-Z0-9_-]/.test(data.username)) {
    throw validationError('Username contains invalid characters', 'username');
  }

  const usernameCheck = await client.rpc('is_username_available', {
    username: data.username,
  });

  if (!usernameCheck.data) {
    throw validationError('Username is already taken', 'username');
  }

  if (!data.displayName) {
    throw validationError('displayName is required', 'displayName');
  }

  if (!data.about) {
    throw validationError('about is required', 'about');
  }

  if (data.about.length > ORGANISATION_DESCRIPTION_MAX_LENGTH) {
    throw validationError(
      `about must be at most ${ORGANISATION_DESCRIPTION_MAX_LENGTH} characters`,
      'about',
    );
  }

  if (!data.coverImages || data.coverImages.length === 0) {
    throw validationError('At least one picture is required', 'coverImages');
  }

  if (data.coverImages.length > MAX_ORGANISATION_COVER_IMAGES) {
    throw validationError(
      `At most ${MAX_ORGANISATION_COVER_IMAGES} pictures are allowed`,
      'coverImages',
    );
  }

  return selectedType;
}
