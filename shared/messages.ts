// HACK - in order to be able to lookup any key in `getFriendlyMessage` we need to include
// a random key so that full typing can't be inferred (leads to index signature error)
const randomKey = Math.random().toString();

// set of mappings to use for system->friendly messages
// some are pulled from error messages, others are hardcoded into the platform but kept
// here to make easier to change in the future
export const FRIENDLY_MESSAGES = {
  '': '',
  'auth/argument-error': 'Please provide a valid email',
  'auth/email-already-in-use': 'The email address is already in use',
  'auth/email-changed':
    "Roger that. We've sent you an email, please click the confirmation link to make the change happen",
  'auth/invalid-email': `That email address doesn't quite look right`,
  'auth/password-changed': 'All done. Password changed',
  'auth/user-not-found': 'No account found, typo maybe?',
  'auth/wrong-password': 'Password does not match the user account',
  'auth/email-not-confirmed':
    "Your email address isn't confirmed yet. Check your inbox, or request a new confirmation email.",
  'auth/confirmation-resent': 'Confirmation email sent, check your inbox (and spam folder).',
  'auth/confirmation-link-requested':
    'If that address has an unconfirmed account, a new link is on its way. Check your inbox (and spam folder).',
  'auth/resend-rate-limited': 'Please wait a minute before requesting another link.',
  'auth/resend-failed': "We couldn't send a new link right now. Please try again in a moment.",
  'generic-error':
    "We couldn't complete your registration. If you already have an account, try logging in or resetting your password.",
  'supporter/already-subscribed': 'This account already has a membership.',
  'supporter/region-blocked': "Supporter memberships aren't available in your region.",
  'supporter/no-membership': "We couldn't find a membership on this account.",
  'supporter/not-pausable': "Only an active membership that isn't set to cancel can be paused.",
  'supporter/not-paused': "This membership isn't paused.",
  'supporter/resume-payment-incomplete':
    "We couldn't take the payment to resume your membership. Complete it on the payment page to finish resuming.",
  'supporter/resume-no-payment-method':
    "There's no payment method on your account. Add one under Manage subscription, then resume again.",
  'supporter/membership-change-failed':
    "We couldn't update your membership. Please try again later.",
  required: 'Required field',
  'reset email sent': 'Reset email sent, check your inbox/spam',
  'profile saved': 'Profile Saved',
  'sign-up/email-required': 'Need an email address',
  'sign-up/password-short': 'Password must be at least 6 characters',
  'sign-up/password-required': 'A password is required unfortunately',
  'sign-up/password-mismatch': 'Your new password does not match',
  'sign-up/password-weak': "Your password isn't strong enough, try something else?",
  'sign-up/captcha-required': 'Please complete the verification challenge',
  'sign-up/terms': 'Consent is required. Gotta tick that box',
  'sign-up/username-short': 'Username must be at least 2 characters',
  'sign-up/username-taken': 'Oh wow, that username is already taken!',
  'sign-up/username-required': 'Username required, like, who are you?',
  [randomKey]: randomKey,
};

/**
 * Conversion for default error messages.
 * @param systemMessage - the message text for lookup in the table.
 * This can either be a status code or full message (depending on how saved above)
 */
export const getFriendlyMessage = (systemMessage = '') => {
  const messageKey = systemMessage.toLowerCase();
  if (Object.hasOwn(FRIENDLY_MESSAGES, messageKey)) {
    return FRIENDLY_MESSAGES[messageKey];
  } else {
    return systemMessage;
  }
};
