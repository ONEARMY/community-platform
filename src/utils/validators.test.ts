import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  composeValidators,
  draftValidationWrapper,
  endsWithQuestionMark,
  minValue,
  noSpecialCharacters,
  validateTitle,
} from './validators';

// Mock out module store to limit impact of circular dependency
vi.mock('src/stores/common/module.store');

import { QUESTION_MIN_TITLE_LENGTH } from 'src/pages/Question/constants';

describe('draftValidationWrapper', () => {
  it('forwards to the validator when draft save is not allowed', () => {
    const allowDraftSave = false;
    const value = 'title';
    const validator = vi.fn();

    draftValidationWrapper(value, { allowDraftSave }, validator);

    expect(validator).toHaveBeenCalledWith(value);
  });

  it('returns undefined when draft save is allowed', () => {
    const allowDraftSave = true;
    const validator = vi.fn();

    draftValidationWrapper('title', { allowDraftSave }, validator);

    expect(validator).toHaveBeenCalledTimes(0);
  });
});

describe('validateTitle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when title reduces to a new slug', async () => {
    const title = 'A Clockwork Orange';
    const validator = validateTitle();

    expect(validator(title)).toEqual(false);
  });
});

describe('noSpecialCharacters', () => {
  it('returns undefined when no special characters are present', () => {
    const result = noSpecialCharacters('validUsername');

    expect(result).toBeUndefined();
  });

  it('returns proper message for email values', () => {
    const result = noSpecialCharacters('someones@email.com');

    expect(result).toContain('Only letters and numbers are allowed');
  });
});

describe('endsWithQuestionMark', () => {
  const errorMessage = 'Needs to end with a question mark';
  it('returns proper message when there is no question mark', () => {
    const result = endsWithQuestionMark();
    expect(result('this is my question')).toContain(errorMessage);
  });

  it('returns proper message when there the question mark is not at the end', () => {
    const result = endsWithQuestionMark();
    expect(result('this is my? question')).toContain(errorMessage);
  });
});

describe('composeValidators', () => {
  it('should join multiple error messages', async () => {
    const composedValidatorsFunc = composeValidators(
      minValue(QUESTION_MIN_TITLE_LENGTH),
      endsWithQuestionMark(),
    );
    const messages = await composedValidatorsFunc('this is');
    expect(messages).toContain('Needs to end with a question mark');
    expect(messages).toContain(`Should be more than ${QUESTION_MIN_TITLE_LENGTH} characters`);
  });
});
