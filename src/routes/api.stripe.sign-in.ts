import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redeemSignInTicket } from 'src/services/supporterSignInTicket.server';
import { methodNotAllowedError } from 'src/utils/httpException';
import { getReturnUrl } from 'src/utils/redirect.server';

// Dedicated sign-in used only by the post-payment "thank you" account setup /
// existing-account login forms (ThankYouAccountForm, ThankYouLoginForm). Those
// forms auto-submit a hidden form with no Turnstile widget, right after the
// supporter flow has already independently verified the user (via account
// creation, password set, or link-account).
//
// This never accepts a raw password - it only accepts a short-lived, single-use
// ticket issued by one of those three routes, so it can't be used as a general
// captcha-free login endpoint for arbitrary credentials. The ticket is redeemed
// into a session via an admin-generated magic link, verified server-side with
// verifyOtp (also not captcha-gated), then handed off to the cookie-wired
// per-request client.
export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  const { client, headers } = createSupabaseServerClient(request);
  const adminClient = createSupabaseAdminServerClient();
  const formData = await request.formData();

  const ticket = formData.get('ticket') as string;
  const email = ticket ? await redeemSignInTicket(ticket) : null;

  if (!email) {
    logger.error('Invalid or expired supporter sign-in ticket');
    return redirect('/sign-in');
  }

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError) {
    logger.error(linkError);
    return redirect('/sign-in');
  }

  if (!linkData) {
    logger.error('generateLink succeeded without data');
    return redirect('/sign-in');
  }

  const { data: verifyData, error: verifyError } = await client.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });

  if (verifyError) {
    logger.error(verifyError);
    return redirect('/sign-in');
  }

  if (!verifyData.user) {
    logger.error('verifyOtp succeeded without a user');
    return redirect('/sign-in');
  }

  const profileService = new ProfileServiceServer(client);
  try {
    await profileService.ensureProfile(verifyData.user);
  } catch (error) {
    logger.error(error);
  }

  return redirect(getReturnUrl(request), { headers });
};
