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
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/****************************************************************************
 *            FORM MUTATORS
 * **************************************************************************/

const addProtocol = ([name], state, { changeValue }) => {
  changeValue(state, name, (val: string) =>
    typeof val === 'string' && val.indexOf('://') === -1
      ? `http://${val}`
      : val,
  )
}

export { validateUrl, validateEmail, required, addProtocol }
