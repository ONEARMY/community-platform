// set of mappings to use for sytem->friendly messages
// some are pulled from error messages, others are hardcoded into the platform but kept
// here to make easier to change in the future
const MESSAGES = {
  '': '',
  'auth/user-not-found': 'No account found, typo maybe?',
  'auth/argument-error': 'Please provide a valid email',
  'Reset email sent': 'Reset email sent, check your inbox/spam',
  'auth/invalid-email': `That email address doesn't quite look right`,
}

/**
 * Conversion for default error messages.
 * @param systemMessage - the message text for lookup in the table.
 * This can either be a status code or full message (depending on how saved above)
 */
export const getFriendlyMessage = (systemMessage: string) => {
  const friendlyMessage = MESSAGES[systemMessage]
  if (!friendlyMessage) {
    console.log(
      `%c No friendly message for [${systemMessage}] \n Maybe you should add one?`,
      'background: #222; color: #bada55',
    )
  }
  return friendlyMessage ? friendlyMessage : systemMessage
}
