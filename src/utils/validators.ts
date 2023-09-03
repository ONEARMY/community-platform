import isUrl from 'is-url'
import { getSpecialCharacters, stripSpecialCharacters } from './helpers'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { ResearchStore } from 'src/stores/Research/research.store'

type storeTypes = HowtoStore | ResearchStore

import type { Mutator } from 'final-form'
/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const required = (value: any) =>
  value ? undefined : 'Make sure this field is filled correctly'

const noSpecialCharacters = (value: string) => {
  const specialCharacters = getSpecialCharacters(value)
  return specialCharacters.length > 0
    ? 'Only letters and numbers are allowed'
    : undefined
}

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

/** Validator method to pass to react-final-form. Takes a given title,
 *  converts to corresponding slug and checks uniqueness.
 *  Provide originalId to prevent matching against own entry.
 *  NOTE - return value represents the error, so FALSE actually means valid
 */
const validateTitle =
  (parentType, id, store: storeTypes) => async (title?: string) => {
    const originalId = parentType === 'edit' ? id : undefined

    if (!title) {
      // if no title submitted, simply return message to say that it is required
      return 'Required'
    }

    const titleReusesSlug = await store.isTitleThatReusesSlug(title, originalId)
    return (
      titleReusesSlug && 'Titles must be unique, please try being more specific'
    )
  }

const draftValidationWrapper = (value, allValues, validator) => {
  return allValues.allowDraftSave ? undefined : validator(value)
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

const setAllowDraftSaveFalse: Mutator = (_, state, utils) =>
  utils.changeValue(state, 'allowDraftSave', () => false)

const setAllowDraftSaveTrue: Mutator = (_, state, utils) => {
  utils.changeValue(state, 'allowDraftSave', () => true)
}

export {
  validateUrl,
  validateUrlAcceptEmpty,
  validateEmail,
  draftValidationWrapper,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
  addProtocolMutator,
  ensureExternalUrl,
  maxValue,
  minValue,
  composeValidators,
  validateTitle,
  noSpecialCharacters,
}
