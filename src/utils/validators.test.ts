import { draftValidationWrapper } from './validators'

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
