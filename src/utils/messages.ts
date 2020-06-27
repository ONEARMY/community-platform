// set of mappings to use for system->friendly messages
// some are pulled from error messages, others are hardcoded into the platform but kept
// here to make easier to change in the future
const MESSAGES = {
  '': '',
  'auth/user-not-found': 'No account found, typo maybe?',
  'auth/argument-error': 'Please provide a valid email',
  'Reset email sent': 'Reset email sent, check your inbox/spam',
  'auth/invalid-email': `That email address doesn't quite look right`,
  'profile saved': 'Profile Saved',
}

export default MESSAGES
