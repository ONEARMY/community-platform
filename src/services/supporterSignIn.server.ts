import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const signInSupporter = async (request: Request, email: string): Promise<Headers> => {
  const { client, headers } = createSupabaseServerClient(request);
  const adminClient = createSupabaseAdminServerClient();

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError || !linkData) {
    logger.error('Supporter sign-in: generateLink failed', linkError);
    return headers;
  }

  const { data: verifyData, error: verifyError } = await client.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });

  if (verifyError || !verifyData.user) {
    logger.error('Supporter sign-in: verifyOtp failed', verifyError);
    return headers;
  }

  try {
    await new ProfileServiceServer(client).ensureProfile(verifyData.user);
  } catch (error) {
    logger.error(error);
  }

  return headers;
};
