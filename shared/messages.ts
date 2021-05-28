// set of mappings to use for system->friendly messages
// some are pulled from error messages, others are hardcoded into the platform but kept
// here to make easier to change in the future
export const FRIENDLY_MESSAGES = {
  '': '',
  'auth/user-not-found': 'No account found, typo maybe?',
  'auth/wrong-password': 'Password does not match the user account',
  'auth/argument-error': 'Please provide a valid email',
  'reset email sent': 'Reset email sent, check your inbox/spam',
  'auth/invalid-email': `That email address doesn't quite look right`,
  'profile saved': 'Profile Saved',
  'sign-up username taken': 'Woops sorry, that Username is already taken',
}

/**
 * Conversion for default error messages.
 * @param systemMessage - the message text for lookup in the table.
 * This can either be a status code or full message (depending on how saved above)
 */
export const getFriendlyMessage = (systemMessage = '') => {
  const friendlyMessage = FRIENDLY_MESSAGES[systemMessage.toLowerCase()]
  if (!friendlyMessage) {
    console.log(
      `%c No friendly message for [${systemMessage}]`,
      'background: #222; color: #bada55',
    )
    return systemMessage
  }
  return friendlyMessage
}
