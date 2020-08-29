import isUrl from 'is-url'
/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const required = (value: any) => (value ? undefined : 'Required')

const validateUrl = (value: any) => {
  if (value) {
    return isUrl(value) ? undefined : 'Invalid url'
  }
  return 'Required'
}

const validateEmail = (value: string) => {
  if (value) {
    return isEmail(value) ? undefined : 'Invalid email'
  }
  return 'Required'
}

const isEmail = (email: string) => {
  // From this stackoverflow thread https://stackoverflow.com/a/46181
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/****************************************************************************
 *            FORM MUTATORS
 * **************************************************************************/

const addProtocolMutator = ([name], state, { changeValue }) => {
  changeValue(state, name, (val: string) => ensureExternalUrl(val))
}
/**
 * Used for user input links, ensure url has http/https protocol as required for external linking,
 * E.g. https://instagram.com/my-username
 */
const ensureExternalUrl = (url: string) =>
  typeof url === 'string' && url.indexOf('://') === -1 ? `https://${url}` : url

export {
  validateUrl,
  validateEmail,
  required,
  addProtocolMutator,
  ensureExternalUrl,
}
