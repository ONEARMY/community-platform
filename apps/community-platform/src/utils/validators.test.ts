import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  draftValidationWrapper,
  noSpecialCharacters,
  validateTitle,
} from './validators'

// Mock out module store to limit impact of circular dependency
vi.mock('src/stores/common/module.store')

import { ResearchStore } from '../stores/Research/research.store'

import type { IRootStore } from 'src/stores/RootStore'

describe('draftValidationWrapper', () => {
  it('forwards to the validator when draft save is not allowed', () => {
    const allowDraftSave = false
    const value = 'title'
    const validator = vi.fn()

    draftValidationWrapper(value, { allowDraftSave }, validator)

    expect(validator).toHaveBeenCalledWith(value)
  })

  it('returns undefined when draft save is allowed', () => {
    const allowDraftSave = true
    const validator = vi.fn()

    draftValidationWrapper('title', { allowDraftSave }, validator)

    expect(validator).toHaveBeenCalledTimes(0)
  })
})

describe('validateTitle', () => {
  const isReusedMock = vi.fn()

  class MockStore extends ResearchStore {
    isTitleThatReusesSlug = isReusedMock
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false when title reduces to a new slug', async () => {
    isReusedMock.mockReturnValue(false)
    const title = 'A Clockwork Orange'
    const validator = validateTitle(
      'create',
      'new-id',
      new MockStore({} as IRootStore),
    )

    expect(await validator(title)).toEqual(false)
    expect(isReusedMock).toHaveBeenCalledWith(title, undefined)
  })

  it('returns helpful message when title reduces to a duplicate slug', async () => {
    isReusedMock.mockReturnValue(true)
    const duplicatedTitle = 'Creating a ToDo list'
    const id = 'existing-id'
    const validator = validateTitle('edit', id, new MockStore({} as IRootStore))

    expect(await validator(duplicatedTitle)).toEqual(
      'Titles must be unique, please try being more specific',
    )
    expect(isReusedMock).toHaveBeenCalledWith(duplicatedTitle, id)
  })
})

describe('noSpecialCharacters', () => {
  it('returns undefined when no special characters are present', () => {
    const result = noSpecialCharacters('validUsername')

    expect(result).toBeUndefined()
  })

  it('returns proper message for email values', () => {
    const result = noSpecialCharacters('someones@email.com')

    expect(result).toContain('Only letters and numbers are allowed')
  })
})
