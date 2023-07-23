import isUrl from 'is-url'
import { stripSpecialCharacters } from './helpers'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { ResearchStore } from 'src/stores/Research/research.store'

type documentTypes = 'howtos' | 'research'
type storeTypes = HowtoStore | ResearchStore
/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const required = (value: any) =>
  value ? undefined : 'Make sure this field is filled correctly'

const maxValue = (max: number) => (value) => {
  const strippedString = stripSpecialCharacters(value)

  return strippedString.length > max
    ? `Should be less or equal to ${max} characters`
    : undefined
}

const minValue = (min: number) => (value) => {
  const strippedString = stripSpecialCharacters(value)

  return strippedString.length < min
    ? `Should be more than ${min} characters`
    : undefined
}

const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined,
    )

const validateUrl = (value: any) => {
  if (value) {
    return isUrl(value) ? undefined : 'Invalid url'
  }
  return 'Required'
}

const validateUrlAcceptEmpty = (value: any) => {
  if (value) {
    return isUrl(value) ? undefined : 'Invalid url'
  }
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
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const validateTitle =
  (parentType, id, documentType: documentTypes, store: storeTypes) =>
  async (value: any) => {
    const originalId = parentType === 'edit' ? id : undefined

    return await store.validateTitleForSlug(value, documentType, originalId)
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
  validateUrlAcceptEmpty,
  validateEmail,
  required,
  addProtocolMutator,
  ensureExternalUrl,
  maxValue,
  minValue,
  composeValidators,
  validateTitle,
}
