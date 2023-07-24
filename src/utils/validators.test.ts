import { draftValidationWrapper, required } from './validators'

describe('required', () => {
  it('returns undefined if value is truthy', () => {
    const value = 'some truthy value'
    const result = required(value)
    const expected = undefined

    expect(result).toEqual(expected)
  })

  it('returns an error message if the value is not truthy', () => {
    const value = ''
    const result = required(value)
    const expected = 'Make sure this field is filled correctly'

    expect(result).toEqual(expected)
  })
})

describe('draftValidationWrapper', () => {
  it('returns the validator when draft save is not allowed', () => {
    const allValues = {
      allowDraftSave: false,
    }
    const value = 'title'
    const validator = jest.fn()

    draftValidationWrapper(value, allValues, validator)

    expect(validator).toHaveBeenCalledWith(value)
  })

  it('returns undefined when draft save is allowed', () => {
    const allValues = {
      allowDraftSave: true,
    }
    const value = 'title'
    const validator = jest.fn()

    draftValidationWrapper(value, allValues, validator)

    expect(validator).toHaveBeenCalledTimes(0)
  })
})
