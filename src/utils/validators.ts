import { FieldValidator } from 'final-form';
import { getSpecialCharacters, stripSpecialCharacters } from './helpers';
import { isUrl } from './urlHelper';

/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const required = (value: any, allValues?: any, meta?: any): string | undefined => {
  return value ? undefined : 'This field is required';
};

const noSpecialCharacters = (value: string): string | undefined => {
  const specialCharacters = value ? getSpecialCharacters(value) : '';
  return specialCharacters.length > 0 ? 'Only letters and numbers are allowed' : undefined;
};

const maxValue =
  (max: number) =>
  (value: string): string | undefined => {
    const strippedString = stripSpecialCharacters(value);

    return strippedString.length > max ? `Should be less or equal to ${max} characters` : undefined;
  };

const minValue =
  (min: number) =>
  (value: string): string | undefined => {
    const strippedString = stripSpecialCharacters(value);

    return strippedString.length < min ? `Should be more than ${min} characters` : undefined;
  };

const endsWithQuestionMark =
  () =>
  (value: string): string | undefined => {
    const lastCharacter = value ? value.slice(-1) : '';
    return lastCharacter !== '?' ? 'Needs to end with a question mark' : undefined;
  };

const composeValidators = (...validators: FieldValidator<any>[]): FieldValidator<any> => {
  return (value, allValues, meta) => {
    const allResponse = validators.map((validator) => validator(value, allValues, meta));

    return allResponse.reduce(
      (message, value) => (typeof value === 'string' ? (message += value + '. ') : message),
      '',
    );
  };
};

const validateUrl = (value: string) => {
  if (value) {
    return isUrl(value) ? undefined : 'Invalid url';
  }
};

const validateUrlAcceptEmpty = (value: string) => {
  if (value) {
    return isUrl(value) ? undefined : 'Invalid url';
  }
};

const validateEmail = (value: string) => {
  if (value) {
    return isEmail(value) ? undefined : 'Invalid email';
  }
  return 'Required';
};

const isEmail = (email: string) => {
  // From this stackoverflow thread https://stackoverflow.com/a/46181
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const draftValidationWrapper = (
  value: string,
  allValues: any,
  validator: FieldValidator<string>,
) => {
  return allValues.allowDraftSave ? undefined : validator(value, allValues);
};

/****************************************************************************
 *            FORM MUTATORS
 * **************************************************************************/

const addProtocolMutator = ([name], state, { changeValue }) => {
  changeValue(state, name, (val: string) => ensureExternalUrl(val));
};
/**
 * Used for user input links, ensure url has http/https protocol as required for external linking,
 * E.g. https://instagram.com/my-username
 */
const ensureExternalUrl = (url: string) =>
  typeof url === 'string' && url.indexOf('://') === -1 ? `https://${url}` : url;

export {
  validateUrl,
  validateUrlAcceptEmpty,
  validateEmail,
  draftValidationWrapper,
  required,
  addProtocolMutator,
  ensureExternalUrl,
  maxValue,
  minValue,
  composeValidators,
  noSpecialCharacters,
  endsWithQuestionMark,
};
