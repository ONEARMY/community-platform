import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Youtube } from './VideoPlayer.stories'

import type { Props } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('uses lazy load mechanism', () => {
    const { getByTitle } = render(<Youtube {...(Youtube.args as Props)} />)

    expect(() =>
      getByTitle('YEAR ONE. Everything we built on our abandoned land'),
    ).toThrow()
  })
})
